import { Args, Resolver, Mutation } from '@nestjs/graphql'
import { PresignedPost } from './presignedPost.model'
import { FileStorageService } from '@island.is/file-storage'

@Resolver()
export class FileUploadResolver {
  constructor(private fileStorageService: FileStorageService) {}

  @Mutation(() => PresignedPost)
  createUploadUrl(
    @Args('filename') filename: string,
  ): Promise<PresignedPost> {
    return this.fileStorageService.generatePresignedPost(filename)
  }
}
