import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'
import { PresignedPost as S3PresignedPost } from '@aws-sdk/s3-presigned-post'

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Mutation(() => PresignedPost)
  createUploadUrl(@Args('filename') filename: string): Promise<S3PresignedPost> {
    return this.fileStorageService.generatePresignedPost(filename)
  }
}
