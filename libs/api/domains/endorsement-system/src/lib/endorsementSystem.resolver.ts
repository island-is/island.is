import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { BypassAuth } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Endorsement } from './models/endorsement.model'
import { EndorsementSystemService } from './endorsementSystem.service'
import { FindEndorsementListInput } from './dto/findEndorsementList.input'
import { CreateEndorsementInput } from './dto/createEndorsement.input'
import { EndorsementList } from './models/endorsementList.model'
import { CreateEndorsementListDto } from './dto/createEndorsementList.input'
import { BulkEndorseListInput } from './dto/bulkEndorseList.input'
import { EndorsementBulkCreate } from './models/endorsementBulkCreate.model'
import { UpdateEndorsementListInput, UpdateEndorsementListDto } from './dto/updateEndorsementList.input'
import { PaginatedEndorsementInput } from './dto/paginatedEndorsement.input'
import { PaginatedEndorsementResponse } from './dto/paginatedEndorsement.response'

import { PaginatedEndorsementListInput } from './dto/paginatedEndorsementList.input'
import { PaginatedEndorsementListResponse } from './dto/paginatedEndorsementList.response'

import { EndorsementPaginationInput } from './dto/endorsementPagination.input'

@UseGuards(IdsUserGuard)
@Resolver('EndorsementSystemResolver')
export class EndorsementSystemResolver {
  constructor(private endorsementSystemService: EndorsementSystemService) {}

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

  @Query(() => PaginatedEndorsementResponse, { nullable: true })
  async endorsementSystemGetEndorsements(
    @Args('input') input: PaginatedEndorsementInput,
    @CurrentUser() user: User,
  ): Promise<PaginatedEndorsementResponse> {
    return await this.endorsementSystemService.endorsementControllerFindAll(
      input,
      user,
    )
  }

  @Mutation(() => Endorsement)
  async endorsementSystemEndorseList(
    @Args('input') input: CreateEndorsementInput,
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

  // lists by tag - bypassauth
  @Query(() => PaginatedEndorsementListResponse)
  @BypassAuth()
  async endorsementSystemFindEndorsementLists(
    @Args('input') input: PaginatedEndorsementListInput,
  ): Promise<PaginatedEndorsementListResponse> {
    return await this.endorsementSystemService.endorsementListControllerFindLists(
      input,
    )
  }

  // GP lists - bypassauth
  @Query(() => PaginatedEndorsementListResponse)
  @BypassAuth()
  async endorsementSystemGetGeneralPetitionLists(
    @Args('input') input: EndorsementPaginationInput,
  ): Promise<PaginatedEndorsementListResponse> {
    return await this.endorsementSystemService.endorsementListControllerGetGeneralPetitionLists(
      input,
    )
  }
  // GP list - bypassauth
  @Query(() => EndorsementList)
  @BypassAuth()
  async endorsementSystemGetGeneralPetitionList(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<EndorsementList | void> {
    return await this.endorsementSystemService.endorsementListControllerGetGeneralPetitionList(
      input,
    )
  }
  // GP list endorsements - bypassauth
  @Query(() => PaginatedEndorsementResponse, { nullable: true })
  @BypassAuth()
  async endorsementSystemGetGeneralPetitionEndorsements(
    @Args('input') input: PaginatedEndorsementInput,
  ): Promise<PaginatedEndorsementResponse> {
    return await this.endorsementSystemService.endorsementControllerGetGeneralPetitionEndorsements(
      input,
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

  @Query(() => PaginatedEndorsementResponse)
  async endorsementSystemUserEndorsements(
    @CurrentUser() user: User,
    @Args('input') input: EndorsementPaginationInput,
  ): Promise<PaginatedEndorsementResponse> {
    return await this.endorsementSystemService.endorsementListControllerFindEndorsements(
      user,
      input,
    )
  }

  @Query(() => PaginatedEndorsementListResponse)
  async endorsementSystemUserEndorsementLists(
    @CurrentUser() user: User,
    @Args('input') input: PaginatedEndorsementListInput,
  ): Promise<PaginatedEndorsementListResponse> {
    return await this.endorsementSystemService.endorsementListControllerFindEndorsementLists(
      user,
      input,
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

  @Mutation(() => EndorsementList)
  async endorsementSystemUpdateEndorsementList(
    @Args('input') { listId, newEndorsementList }: UpdateEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerUpdate(
      {
        listId,
        updateEndorsementListDto: newEndorsementList,
      },
      user,
    )
  }
}
