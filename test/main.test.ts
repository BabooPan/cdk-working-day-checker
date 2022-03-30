import '@aws-cdk/assert/jest';
import { App } from '@aws-cdk/core';
import { Template } from '@aws-cdk/assertions';
import { CdkWorkingDayChecker } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new CdkWorkingDayChecker(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});