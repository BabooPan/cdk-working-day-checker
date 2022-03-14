const { awscdk } = require('projen');

const PROJECT_NAME = 'cdk-working-day-checker';
const PROJECT_DESCRIPTION = 'Check today is TW\'s working day or not.';

const project = new awscdk.AwsCdkTypeScriptApp({
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/baboopan/cdk-working-day-checker.git',
  authorName: 'Baboo Pan',
  authorEmail: 'lpig0818@gmail.com',
  keywords: ['aws', 'api', 'cdk', 'lambda', 'typescript'],
  release: false,
  stability: 'experimental',
  autoDetectBin: false,
  dependabot: false,
  cdkVersion: '1.148.0',
  // Default release the main branch with major version 1.
  majorVersion: 1,
  defaultReleaseBranch: 'master',
  cdkDependencies: [
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-python',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-apigatewayv2',
    '@aws-cdk/aws-apigatewayv2-integrations',
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-route53-targets'
  ],
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      // The secret default name use  PROJEN_GITHUB_TOKEN, please add your PAT token in this repository secret.
      // ref: https://github.com/projen/projen/blob/e5899dd04a575209424a08fe90bde99e07ac6c7b/src/github/github.ts#L46-L53
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    // deepcode ignore HardcodedNonCryptoSecret: Allow to preform GitHub Actions
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['baboopan'],
  },
  devDeps: [
    'esbuild',
  ],
  gitignore: [
    'src/config.ts',
    '.vscode',
    '.dccache',
    'cdk.out',
    'cdk.context.json',
    'yarn-error.log',
    'coverage',
    'venv',
    'tsconfig.json',
    'tsconfig.dev.json'
  ],
});

project.synth();
