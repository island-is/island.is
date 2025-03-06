import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'
import { PresignedPost as S3PresignedPost } from '@aws-sdk/s3-presigned-post'
import { MalwareScanStatus } from './malwareScanStatus.model'

const MALWARE_FETCH_ATTEMPTS = 4
const MALWARE_MIN_MS_BETWEEN_FETCHES = 1000

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Query(() => MalwareScanStatus)
  async malwareScanStatus(
    @Args('filename') filename: string,
  ): Promise<MalwareScanStatus> {
    let scanStatus = undefined
    console.log('starting loop with file:', filename)
    for (let i = 0; i < MALWARE_FETCH_ATTEMPTS; i++) {
      const waitTimeThisLoop = MALWARE_MIN_MS_BETWEEN_FETCHES * (Math.pow(2, i))
      await new Promise((resolve) => setTimeout(resolve, waitTimeThisLoop))

      const tags = await this.fileStorageService.getFileTags(filename)
      scanStatus = tags.find(tag => tag.Key === 'GuardDutyMalwareScanStatus')
      console.log('scan status:', scanStatus)
      if(scanStatus !== undefined) {
        break
      }
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