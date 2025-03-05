import { Args, Resolver, Mutation, Query } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'
import { PresignedPost as S3PresignedPost } from '@aws-sdk/s3-presigned-post'
import { FileUploadTag } from './getAttachmentTags.model'

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Query(() => [FileUploadTag])
  async getFileUploadTags(
    @Args('filename') filename: string,
  ): Promise<FileUploadTag[]> {
    const tags = await this.fileStorageService.getFileTags(filename)
    return Object.values(tags.map( tag => ({
      key: tag.Key ?? '',
      value: tag.Value ?? ''
    })))
  }

  @Mutation(() => PresignedPost)
  createUploadUrl(
    @Args('filename') filename: string,
  ): Promise<S3PresignedPost> {
    return this.fileStorageService.generatePresignedPost(filename)
  }
}