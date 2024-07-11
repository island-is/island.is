import { Injectable, Inject } from '@nestjs/common'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Response } from 'node-fetch'
import { Readable } from 'stream'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CompleteMultipartUploadOutput } from 'aws-sdk/clients/s3'

type S3Location = {
  fileName: string
  bucket: string
}

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.s3Client = new S3Client({ apiVersion: '2006-03-01' })
  }

  private async uploadFromStream(
    fileResponse: Response,
    { fileName, bucket }: S3Location,
  ): Promise<CompleteMultipartUploadOutput> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucket,
        Key: fileName,
        ContentType: 'application/pdf',
        Body: fileResponse.body as Readable,
      },
    })

    this.logger.debug(`Uploading to bucket`, {
      fileName,
      bucket,
    })
    return await upload.done()
  }

  async uploadFileFromStream(
    stream: Response,
    s3Location: S3Location,
  ): Promise<string | null> {
    return this.uploadFromStream(stream, s3Location)
      .then(async () => {
        const oneMinutePlus = 65 // leave extra 5 seconds for network delay
        const command = new GetObjectCommand({
          Bucket: s3Location.bucket,
          Key: s3Location.fileName,
        })
        return getSignedUrl(this.s3Client, command, {
          expiresIn: oneMinutePlus,
        })
      })
      .catch((err) => {
        this.logger.error(err)
        return null
      })
  }
}
