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
  recordName: process.env.RECORD_NAME ?? 'workingday',
  domainName: process.env.DOMAIN_NAME ?? 'example.com',
  zoneId: process.env.ZONE_ID ?? 'Z0000000000000000000',
  certArn: process.env.CERT_ARN ?? 'arn:aws:acm:us-west-2:000000000000:certificate/00000000-0000-0000-0000-000000000000',
};
