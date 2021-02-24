declare module 'amazon-s3-uri' {
  export interface S3UriInformation {
    bucket: string
    region: string
    key: string
  }
  function AmazonS3Uri(uri: string): S3UriInformation

  export = AmazonS3Uri
}
