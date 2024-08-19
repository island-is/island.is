import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { Injectable } from '@nestjs/common'
import { environment } from '../../../environments'

@Injectable()
export class CloudFrontService {
  createPresignedPost(url: string): string {
    const expiresInSeconds = environment.files.postTimeToLiveMinutes * 60

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)

    return getSignedUrl({
      keyPairId: environment.files.cloudFrontPublicKeyId,
      privateKey: environment.files.cloudFrontPrivateKey,
      dateLessThan: expiresAt.toISOString(),
      url,
    })
  }
}
