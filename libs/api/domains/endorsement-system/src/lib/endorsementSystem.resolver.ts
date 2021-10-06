import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Endorsement } from './models/endorsement.model'
import { EndorsementSystemService } from './endorsementSystem.service'
import { FindEndorsementListInput } from './dto/findEndorsementList.input'
import { EndorsementList } from './models/endorsementList.model'
import { FindEndorsementListByTagsDto } from './dto/findEndorsementListsByTags.dto'
import { CreateEndorsementListDto } from './dto/createEndorsementList.input'
import { BulkEndorseListInput } from './dto/bulkEndorseList.input'
import { EndorsementBulkCreate } from './models/endorsementBulkCreate.model'

@UseGuards(IdsUserGuard)
@Resolver('EndorsementSystemResolver')
export class EndorsementSystemResolver {
  constructor(private endorsementSystemService: EndorsementSystemService) {}

  // endorsement
  @Query(() => Endorsement, { nullable: true })
  async endorsementSystemGetSingleEndorsement(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementSystemService.endorsementControllerFindByAuth(
      input,
      user,
    )
  }

  @Query(() => [Endorsement], { nullable: true })
  async endorsementSystemGetEndorsements(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<Endorsement[]> {
    return await this.endorsementSystemService.endorsementControllerFindAll(
      input,
      user,
    )
  }

  @Mutation(() => Endorsement)
  async endorsementSystemEndorseList(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<Endorsement> {
    return await this.endorsementSystemService.endorsementControllerCreate(
      input,
      user,
    )
  }

  @Mutation(() => EndorsementBulkCreate)
  async endorsementSystemBulkEndorseList(
    @Args('input') { listId, nationalIds }: BulkEndorseListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementBulkCreate> {
    return await this.endorsementSystemService.endorsementControllerBulkCreate(
      {
        listId,
        bulkEndorsementDto: { nationalIds },
      },
      user,
    )
  }

  @Mutation(() => Boolean)
  async endorsementSystemUnendorseList(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.endorsementSystemService.endorsementControllerDelete(
      input,
      user,
    )
  }

  // Endorsement list
  @Query(() => [EndorsementList])
  async endorsementSystemFindEndorsementLists(
    @Args('input') input: FindEndorsementListByTagsDto,
    @CurrentUser() user: User,
  ): Promise<EndorsementList[]> {
    return await this.endorsementSystemService.endorsementListControllerFindLists(
      input,
      user
    )
  }

  @Query(() => EndorsementList, { nullable: true })
  async endorsementSystemGetSingleEndorsementList(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerFindOne(
      input,
      user,
    )
  }

  @Query(() => [Endorsement])
  async endorsementSystemUserEndorsements(
    @CurrentUser() user: User,
  ): Promise<Endorsement[]> {
    return await this.endorsementSystemService.endorsementListControllerFindEndorsements(
      user,
    )
  }

  @Mutation(() => EndorsementList)
  async endorsementSystemCreateEndorsementList(
    @Args('input') input: CreateEndorsementListDto,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerCreate(
      {
        endorsementListDto: input,
      },
      user,
    )
  }
}
