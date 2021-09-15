import { CloudFront } from 'aws-sdk'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'

@Injectable()
export class CloudFrontService {
  private readonly signer: CloudFront.Signer

  constructor() {
    this.signer = new CloudFront.Signer(
      environment.files.cloudFrontPublicKeyId,
      environment.files.cloudFrontPrivateKey,
    )
  }

  createPresignedPost(url: string): string {
    const expiresInSeconds = environment.files.postTimeToLiveMinutes * 60

    const expires = Math.floor((Date.now() + expiresInSeconds * 1000) / 1000)

    return this.signer.getSignedUrl({
      url,
      expires,
    })
  }
}
