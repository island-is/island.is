import { Injectable } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { S3 } from 'aws-sdk'
import { Response } from 'node-fetch'
import stream from 'stream'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

type S3Location = {
  fileName: string
  bucket: string
}

type FileUpload = {
  passThrough: stream.PassThrough
  promise: Promise<S3.ManagedUpload.SendData>
}

@Injectable()
export class S3Service {
  private readonly s3: S3

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.s3 = new S3({ apiVersion: '2006-03-01' })
  }

  private uploadFromStream(
    fileResponse: Response,
    { fileName, bucket }: S3Location,
  ): FileUpload {
    const passThrough = new stream.PassThrough()
    const promise = this.s3
      .upload({
        Bucket: bucket,
        Key: fileName,
        ContentType: 'application/pdf',
        Body: passThrough,
      })
      .promise()
    return { passThrough, promise }
  }

  async uploadFileFromStream(
    stream: Response,
    s3Location: S3Location,
  ): Promise<string | null> {
    const { passThrough, promise } = this.uploadFromStream(stream, s3Location)

    stream.body.pipe(passThrough)

    return promise
      .then((result) => {
        const oneMinutePlus = 65 // leave extra 5 seconds for network delay
        return this.s3.getSignedUrlPromise('getObject', {
          Bucket: s3Location.bucket,
          Key: result.Key,
          Expires: oneMinutePlus,
        })
      })
      .catch((err) => {
        this.logger.error(err)
        return null
      })
  }
}
