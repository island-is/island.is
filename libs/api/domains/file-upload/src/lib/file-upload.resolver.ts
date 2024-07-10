import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Mutation(() => PresignedPost)
  async createUploadUrl(
    @Args('filename') filename: string,
  ): Promise<PresignedPost> {
    const result = await this.fileStorageService.generatePresignedPost(filename)
    return {
      url: result.url,
      fields: result.fields,
    }
  }
}
