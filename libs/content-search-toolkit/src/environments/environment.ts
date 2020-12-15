export const environment = {
  production: false,
  elastic: {
    node: process.env.ELASTIC_NODE || 'http://localhost:9200',
  },
  kibana: {
    url: process.env.KIBANA_URL || 'http://localhost:5601',
  },
  awsWebIdentityTokenFile: process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
  awsRoleName: process.env.AWS_ROLE_ARN,
}
