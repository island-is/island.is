import * as express from 'express'
import { S3 } from 'aws-sdk'
import { logger } from '@island.is/logging'

import stream from 'stream'

export const error = (res: express.Response, error: string, status = 400) => {
  logger.warn(`Sending error "${error}" with status ${status}`)
  return res.status(status).send({ error })
}

// In case we want to invalidate all caches in code
const salt = '3'
export const getCacheId = (key: string, version: string) =>
  `${key}:${version}:${salt}`

const uploadChunkSize = 32 * 1024 * 1024

export const uploadChunkStream = (
  s3: S3,
  Bucket: string,
  UploadId: string,
  key: string,
  ContentLength: number,
  PartNumber: number,
) => {
  const pass = new stream.PassThrough()
  return {
    writeStream: pass,
    promise: s3
      .uploadPart({
        Body: pass,
        Bucket,
        Key: key,
        PartNumber,
        ContentLength,
        UploadId,
      })
      .promise(),
  }
  // return pass
}

export class GetContentInfoError extends Error {}

export const getContentInfo = (req: express.Request) => {
  const header = req.header('content-range')
  if (!header) {
    throw new GetContentInfoError('No content-range header found')
  }
  const [_, contentRange] = header.split(' ')
  if (!contentRange) {
    throw new GetContentInfoError(`No range found in content range "${header}"`)
  }
  const [fromByte, toByte] = contentRange.split('-').map((s) => parseInt(s, 10))
  if (!toByte || isNaN(fromByte) || isNaN(toByte)) {
    throw new GetContentInfoError(`No byterange found in ${contentRange}`)
  }
  return {
    contentLength: toByte - fromByte + 1,
    partNumber: Math.floor(toByte / uploadChunkSize + 1),
  }
}
