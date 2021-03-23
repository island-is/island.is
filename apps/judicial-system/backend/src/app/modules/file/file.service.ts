import * as AWS from 'aws-sdk'
import { uuid } from 'uuidv4'

import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreatePresignedPostDto } from './dto'
import { PresignedPost } from './models'

@Injectable()
export class FileService {
  private readonly s3: AWS.S3

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.s3 = new AWS.S3({ region: environment.files.region })
  }

  async createPresignedPost(
    caseId: string,
    createPresignedPost: CreatePresignedPostDto,
  ): Promise<PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: environment.files.bucket,
          Expires: environment.files.timeToLivePost,
          Fields: {
            key: `${caseId}/${uuid()}_${createPresignedPost.fileName}`,
          },
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            console.log(data)
            resolve(data)
          }
        },
      )
    })
  }
}
