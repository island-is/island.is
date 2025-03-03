import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'
import { PresignedPost as S3PresignedPost } from '@aws-sdk/s3-presigned-post'
import { TagType } from './getAttachmentTags.model'
import { Tag } from '@aws-sdk/client-s3'

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Query(() => [TagType])
  async getAttachmentTags(
    @Args('url') url: string,
  ): Promise<Tag[]> {
    return this.fileStorageService.getAttachmentTags(url)
  }

  @Mutation(() => PresignedPost)
  createUploadUrl(
    @Args('filename') filename: string,
  ): Promise<S3PresignedPost> {
    return this.fileStorageService.generatePresignedPost(filename)
  }
}