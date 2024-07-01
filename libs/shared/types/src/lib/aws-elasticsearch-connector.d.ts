declare module 'aws-elasticsearch-connector' {
  import { Connection, Transport } from '@elastic/elasticsearch'
  import { Config } from 'aws-sdk'

  export type Connector = {
    Connection: typeof Connection
    Transport: typeof Transport
  }

  export const ConnectorFactory: (awsConfig: Config) => Connector

  export default ConnectorFactory
}
