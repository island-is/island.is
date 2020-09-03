import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { S3 } from 'aws-sdk'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Mutation(() => PresignedPost)
  createUploadUrl(
    @Args('filename') filename: string,
  ): Promise<S3.PresignedPost> {
    return this.fileStorageService.generatePresignedPost(filename)
  }
}
