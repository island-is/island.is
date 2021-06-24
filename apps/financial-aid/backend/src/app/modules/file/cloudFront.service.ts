import { CloudFront } from 'aws-sdk'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { PresignedPostModel } from './models'

@Injectable()
export class CloudFrontService {
  private readonly signer: CloudFront.Signer

  constructor() {
    this.signer = new CloudFront.Signer(
      environment.files.cloudFrontPublicKeyId,
      environment.files.cloudFrontPrivateKey,
    )
  }

  createPresignedPost(url: string): PresignedPostModel {
    const expiresInSeconds = environment.files.postTimeToLiveMinutes * 60

    const expires = Math.floor((Date.now() + expiresInSeconds * 1000) / 1000)

    const signedUrl = this.signer.getSignedUrl({
      url,
      expires,
    })

    return { url: signedUrl }
  }
}
