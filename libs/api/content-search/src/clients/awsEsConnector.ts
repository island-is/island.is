import { Connection as UnsignedConnection } from '@elastic/elasticsearch'
import * as AWS from 'aws-sdk'
import RequestSigner from 'aws-sdk/lib/signers/v4'
import { ClientRequest, IncomingMessage } from 'http'
import { Readable as ReadableStream } from 'stream'

class AwsElasticsearchError extends Error {}

type RequestOptions = Parameters<UnsignedConnection['request']>[0]

// See https://stackoverflow.com/a/61595022
class AwsSignedConnection extends UnsignedConnection {
  public request(
    params: RequestOptions,
    callback: (err: Error | null, response: IncomingMessage | null) => void,
  ): ClientRequest {
    const signedParams = this.signParams(params)
    return super.request(signedParams, callback)
  }

  private signParams(params: RequestOptions): RequestOptions {
    const region = AWS.config.region || process.env.AWS_DEFAULT_REGION
    if (!region) {
      throw new AwsElasticsearchError('missing region configuration')
    }
    if (!params.method) {
      throw new AwsElasticsearchError('missing request method')
    }
    if (!params.path) {
      throw new AwsElasticsearchError('missing request path')
    }
    if (!params.headers) {
      throw new AwsElasticsearchError('missing request headers')
    }

    const endpoint = new AWS.Endpoint(this.url.href)
    const request = new AWS.HttpRequest(endpoint, region)

    request.method = params.method
    request.path = params.querystring
      ? `${params.path}/?${params.querystring}`
      : params.path

    if (params.body instanceof Buffer) {
      request.body = params.body.toString()
    } else if (params.body instanceof ReadableStream) {
      request.body = params.body.toString()
    } else if (typeof params.body === 'string') {
      request.body = params.body
    }

    Object.entries(params.headers).forEach(([header, value]) => {
      if (value === undefined) {
        return
      }
      if (typeof value === 'string') {
        request.headers[header] = value
      } else if (typeof value === 'number') {
        request.headers[header] = `${value}`
      } else {
        request.headers[header] = value.join(' ')
      }
    })
    request.headers.Host = endpoint.host

    const signer = new RequestSigner(request, 'es')
    signer.addAuthorization(AWS.config.credentials, new Date())

    return request
  }
}

export { AwsSignedConnection, UnsignedConnection, AwsElasticsearchError }
