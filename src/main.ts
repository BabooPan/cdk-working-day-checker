import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { PythonFunction } from "@aws-cdk/aws-lambda-python";
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigatewayv2";
import * as apigwInt from "@aws-cdk/aws-apigatewayv2-integrations";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";

export class CdkWorkingDayChecker extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const WorkingDayCheckerFunction = new PythonFunction(this, 'workingDayCheckerFunction', {
      entry: './resources/',
      index: 'lambda_function.py',
      handler: 'lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_8
    });

    const getCheckerIntegration = new apigwInt.LambdaProxyIntegration({
      handler: WorkingDayCheckerFunction,
    });
    
    // Please modify to yours
    const [recordName, domainName, zoneId, certArn] = ['', '', '', '']
    
    const apiCustomDomain = new apigw.DomainName(this, 'apiCustomDomain', {
      domainName: recordName + '.' + domainName,
      certificate: Certificate.fromCertificateArn(this, 'cert', certArn),
    });
    
    const httpApi = new apigw.HttpApi(this, 'workingDayCheckerApi', {
      defaultDomainMapping: {
        domainName: apiCustomDomain
      },
    });
    
    httpApi.addRoutes({
      path: '/',
      methods: [ apigw.HttpMethod.GET ],
      integration: getCheckerIntegration,
    });

    const zone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone',{ 
      zoneName: domainName,
      hostedZoneId: zoneId,
    });

    new route53.ARecord(this, 'AliasRecord', {
      zone,
      recordName,
      target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2Domain(apiCustomDomain)),
    });

    new CfnOutput(this, 'apigw-endpoint',{ value: httpApi.apiEndpoint});
    new CfnOutput(this, 'openapi-endpoint',{ value: ('https://' + recordName + '.' + domainName)});

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