import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'
import { PresignedPost as S3PresignedPost } from '@aws-sdk/s3-presigned-post'
import { MalwareScanStatus } from './malwareScanStatus.model'

const MALWARE_FETCH_ATTEMPTS = 5
const MALWARE_MIN_MS_BETWEEN_FETCHES = 500

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Query(() => MalwareScanStatus)
  async malwareScanStatus(
    @Args('filename') filename: string,
  ): Promise<MalwareScanStatus> {
    let scanStatus = undefined
    for (let i = 0; i < MALWARE_FETCH_ATTEMPTS; i++) {
      const tags = await this.fileStorageService.getFileTags(filename)
      scanStatus = tags.find((tag) => tag.Key === 'GuardDutyMalwareScanStatus')

      if (scanStatus !== undefined) {
        break
      }

      const waitTimeThisLoop = MALWARE_MIN_MS_BETWEEN_FETCHES * Math.pow(2, i)
      await new Promise((resolve) => setTimeout(resolve, waitTimeThisLoop))
    }

    if (!scanStatus) {
      return MalwareScanStatus.UNKNOWN
    }

    switch (scanStatus.Value) {
      case 'NO_THREATS_FOUND':
        return MalwareScanStatus.SAFE
      case 'THREATS_FOUND':
        return MalwareScanStatus.UNSAFE
      default:
        return MalwareScanStatus.UNKNOWN
    }
  }

  @Mutation(() => PresignedPost)
  createUploadUrl(
    @Args('filename') filename: string,
  ): Promise<S3PresignedPost> {
    return this.fileStorageService.generatePresignedPost(filename)
  }
}
