import {
  Args,
  Query,
  Resolver,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
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
import {
  UpdateEndorsementListInput,
  UpdateEndorsementListDto,
} from './dto/updateEndorsementList.input'
import { PaginatedEndorsementInput } from './dto/paginatedEndorsement.input'
import { PaginatedEndorsementResponse } from './dto/paginatedEndorsement.response'

import { PaginatedEndorsementListInput } from './dto/paginatedEndorsementList.input'
import { PaginatedEndorsementListResponse } from './dto/paginatedEndorsementList.response'

import { EndorsementPaginationInput } from './dto/endorsementPagination.input'
import { OpenListInput } from './dto/openList.input'
import { sendPdfEmailResponse } from './dto/sendPdfEmail.response'
import { sendPdfEmailInput } from './dto/sendPdfEmail.input'

@UseGuards(IdsUserGuard)
@Resolver(() => EndorsementList)
export class EndorsementSystemResolver {
  constructor(private endorsementSystemService: EndorsementSystemService) {}

  @ResolveField('ownerName', () => String, { nullable: true })
  resolveOwnerName(@Parent() list: EndorsementList): Promise<String | null> {
    return this.endorsementSystemService.endorsementListControllerGetOwnerName({
      listId: list.id,
    })
  }

  // GET /endorsement-list/{listId}/endorsement/exists
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

  // GET /endorsement-list/{listId}/endorsement
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

  // POST /endorsement-list/{listId}/endorsement
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

  // POST /endorsement-list/{listId}/endorsement/bulk
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

  // DELETE /endorsement-list/{listId}/endorsement
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

  // GET /endorsement-list ... by tags
  @Query(() => PaginatedEndorsementListResponse)
  @BypassAuth()
  async endorsementSystemFindEndorsementLists(
    @Args('input') input: PaginatedEndorsementListInput,
  ): Promise<PaginatedEndorsementListResponse> {
    return await this.endorsementSystemService.endorsementListControllerFindLists(
      input,
    )
  }

  // GET /endorsement-list/general-petition-lists
  @Query(() => PaginatedEndorsementListResponse)
  @BypassAuth()
  async endorsementSystemGetGeneralPetitionLists(
    @Args('input') input: EndorsementPaginationInput,
  ): Promise<PaginatedEndorsementListResponse> {
    return await this.endorsementSystemService.endorsementListControllerGetGeneralPetitionLists(
      input,
    )
  }

  // GET /endorsement-list/general-petition-list/{listId}
  @Query(() => EndorsementList)
  @BypassAuth()
  async endorsementSystemGetGeneralPetitionList(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<EndorsementList | void> {
    return await this.endorsementSystemService.endorsementListControllerGetGeneralPetitionList(
      input,
    )
  }

  // GET /endorsement-list/{listId}/endorsement/general-petition
  @Query(() => PaginatedEndorsementResponse, { nullable: true })
  @BypassAuth()
  async endorsementSystemGetGeneralPetitionEndorsements(
    @Args('input') input: PaginatedEndorsementInput,
  ): Promise<PaginatedEndorsementResponse> {
    return await this.endorsementSystemService.endorsementControllerGetGeneralPetitionEndorsements(
      input,
    )
  }

  // GET /endorsement-list/{listId}
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

  // GET /endorsement-list/endorsements
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

  // GET /endorsement-list/endorsementLists
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

  // POST /endorsement-list
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
    @Args('input') { listId, endorsementList }: UpdateEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerUpdate(
      {
        listId,
        updateEndorsementListDto: endorsementList,
      },
      user,
    )
  }
  // PUT /endorsement-list/{listId}/close
  @Mutation(() => EndorsementList)
  async endorsementSystemCloseEndorsementList(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerClose(
      input,
      user,
    )
  }

  // PUT /endorsement-list/{listId}/open
  @Mutation(() => EndorsementList)
  async endorsementSystemOpenEndorsementList(
    @Args('input') input: OpenListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerOpen(
      input,
      user,
    )
  }

  // PUT /endorsement-list/{listId}/lock
  @Mutation(() => EndorsementList)
  async endorsementSystemLockEndorsementList(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerLock(
      input,
      user,
    )
  }

  // PUT /endorsement-list/{listId}/unlock
  @Mutation(() => EndorsementList)
  async endorsementSystemUnlockEndorsementList(
    @Args('input') input: FindEndorsementListInput,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerUnlock(
      input,
      user,
    )
  }

  @Mutation(() => sendPdfEmailResponse)
  async endorsementSystemsendPdfEmail(
    @Args('input') input: sendPdfEmailInput,
    @CurrentUser() user: User,
  ): Promise<{ success: boolean }> {
    return await this.endorsementSystemService.endorsementControllerSendPdfEmail(
      input,
      user,
    )
  }
}
