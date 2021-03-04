import { App, Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { PythonFunction } from "@aws-cdk/aws-lambda-python";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigatewayv2";
import * as apigwInt from "@aws-cdk/aws-apigatewayv2-integrations";

export class CdkWorkingDayChecker extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // LaambdaFunction that returns 201 with "Hello world!"
    const WorkingDayCheckerFunction = new PythonFunction(this, 'WorkingDayCheckerFunction', {
      entry: './resources/',
      index: 'lambda_function.py',
      handler: 'lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_8
    });

    const getCheckerIntegration = new apigwInt.LambdaProxyIntegration({
      handler: WorkingDayCheckerFunction,
    });

    // Rest API backed by the helloWorldFunction
    const httpApi = new apigw.HttpApi(this, 'HttpApi');
    
    httpApi.addRoutes({
      path: '/',
      methods: [ apigw.HttpMethod.GET ],
      integration: getCheckerIntegration,
    });

    new CfnOutput(
      this, 'api-endpoint',
      {
        value: httpApi.apiEndpoint
      }
    )

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