export interface recordProps {
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

export const record:recordProps = {
  recordName: 'record',
  domainName: 'example.com',
  zoneId: 'Zxxxxxxx01234',
  certArn: 'arn:aws:acm:REGION_CODE:ACCOUNT_ID:certificate/RESOURCE_ID',
};
