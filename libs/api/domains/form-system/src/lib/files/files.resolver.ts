import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { StoreFileInput } from '../../dto/files.input'
import { FilesService } from './files.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => Boolean, {
    name: 'storeFormSystemFile',
    nullable: true,
  })
  async storeFile(
    @Args('input', { type: () => StoreFileInput })
    input: StoreFileInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.filesService.storeFile(user, input)
  }
}
