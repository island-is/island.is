import { Args, Mutation,Resolver } from '@nestjs/graphql'
import { S3 } from 'aws-sdk'

import { FileStorageService } from '@island.is/file-storage'

import { PresignedPost } from './presignedPost.model'

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
