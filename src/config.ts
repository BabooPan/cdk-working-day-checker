export interface RecordProps {
  /**
     * The record goona be created in the specific domain.
     */
  readonly recordName: string;
  /**
     * The domain name goona be used to create record and where the cert in.
     */
  readonly domainName: string;
  /**
     * The domain id from Route53 goona be used to create record and where the cert in.
     */
  readonly zoneId: string;
  /**
     * The ACM ARN specific to the API GW custom domain name
     */
  readonly certArn: string;
}

export const record:RecordProps = {
  recordName: 'workingday',
  domainName: 'baboopan.net',
  zoneId: 'Z00292561235P7FTLUPZ9',
  certArn: 'arn:aws:acm:us-west-2:471856162574:certificate/63d81b75-628d-4ee7-8696-46f619e8c77e',
};
