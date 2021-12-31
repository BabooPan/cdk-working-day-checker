import { record } from './config'
import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigwv2 from '@aws-cdk/aws-apigatewayv2';
import * as apigwInt from '@aws-cdk/aws-apigatewayv2-integrations';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';
// import * as path from 'path';

export class CdkWorkingDayChecker extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /** 
     * Lack support for custom modules in Python
     */
    // const WorkingDayCheckerFunction = new lambda.Function(this, 'workingDayCheckerFunction', {
    //   runtime: lambda.Runtime.PYTHON_3_9,
    //   code: lambda.Code.fromAsset(path.join('./lambda-handler')),
    //   handler: 'index.lambda_handler',
    //   architectures: [lambda.Architecture.ARM_64]
    // });
    
    const WorkingDayCheckerFunction = new PythonFunction(this, 'workingDayCheckerFunction', {
      entry: './lambda-handler/',
      index: 'index.py',
      handler: 'lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
      // Due to local device is base on x86, un-support local test for arm64
      // architectures: [lambda.Architecture.ARM_64]
    });

    // const getCheckerIntegration = new apigwInt.LambdaProxyIntegration({
    const getCheckerIntegration = new apigwInt.HttpLambdaIntegration(
      'checkerIntegration',
      WorkingDayCheckerFunction
    );
    
    const apiCustomDomain = new apigwv2.DomainName(this, 'apiCustomDomain', {
      domainName: record.recordName + '.' + record.domainName,
      certificate: Certificate.fromCertificateArn(this, 'cert', record.certArn),
    });
    
    const httpApi = new apigwv2.HttpApi(this, 'workingDayCheckerApi', {
      createDefaultStage: false
    });

    httpApi.addRoutes({
      path: '/',
      methods: [ apigwv2.HttpMethod.GET ],
      integration: getCheckerIntegration
    });

    const apiStage = httpApi.addStage('dev', {
      stageName: 'dev',
      autoDeploy: true,
      domainMapping: {
        domainName: apiCustomDomain
      },
    });

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone',{ 
      zoneName: record.domainName,
      hostedZoneId: record.zoneId
    });
    
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: record.recordName,
      target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(apiCustomDomain.regionalDomainName, apiCustomDomain.regionalHostedZoneId))
    });

    const stageCfnResource = apiStage.node.defaultChild as apigwv2.CfnStage;
    stageCfnResource.addPropertyOverride('DefaultRouteSettings', { ThrottlingRateLimit: 5 });

    new CfnOutput(this, 'apigw-endpoint',{ value: httpApi.apiEndpoint + '/dev/'});
    new CfnOutput(this, 'openapi-endpoint',{ value: ('https://' + record.recordName + '.' + record.domainName)});
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new CdkWorkingDayChecker(app, 'cdk-working-day-checker', { env: devEnv });

app.synth();