import { Args, Query, Resolver, Mutation } from '@nestjs/graphql'
import { IdsAuthGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Endorsement } from './models/endorsement.model'
import { EndorsementSystemService } from './endorsementSystem.service'
import { FindEndorsementListInput } from './dto/findEndorsementList.input'
import { EndorsementList } from './models/endorsementList.model'
import { FindEndorsementListByTagDto } from './dto/findEndorsementListsByTag.dto'
import { CreateEndorsementListDto } from './dto/createEndorsementList.input'
import { BulkEndorseListInput } from './dto/bulkEndorseList.input'

// @UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver('EndorsementSystemResolver')
export class EndorsementSystemResolver {
  constructor(private endorsementSystemService: EndorsementSystemService) {}

  // endorsement
  @Query(() => Endorsement, { nullable: true })
  async endorsementSystemGetSingleEndorsement(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<Endorsement> {
    return await this.endorsementSystemService.endorsementControllerFindOne(
      input,
    )
  }

  @Mutation(() => Endorsement)
  async endorsementSystemEndorseList(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<Endorsement> {
    return await this.endorsementSystemService.endorsementControllerCreate(
      input,
    )
  }

  @Mutation(() => [Endorsement])
  async endorsementSystemBulkEndorseList(
    @Args('input') { listId, nationalIds }: BulkEndorseListInput,
  ): Promise<Endorsement[]> {
    return await this.endorsementSystemService.endorsementControllerBulkCreate({
      listId,
      bulkEndorsementDto: { nationalIds },
    })
  }

  @Mutation(() => Boolean)
  async endorsementSystemUnendorseList(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<boolean> {
    return await this.endorsementSystemService.endorsementControllerDelete(
      input,
    )
  }

  // Endorsement list
  @Query(() => [EndorsementList])
  async endorsementSystemFindEndorsementLists(
    @Args('input') input: FindEndorsementListByTagDto,
  ): Promise<EndorsementList[]> {
    return await this.endorsementSystemService.endorsementListControllerFindLists(
      input,
    )
  }

  @Query(() => EndorsementList, { nullable: true })
  async endorsementSystemGetSingleEndorsementList(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerFindOne(
      input,
    )
  }

  @Query(() => [Endorsement])
  async endorsementSystemUserEndorsements(): Promise<Endorsement[]> {
    return await this.endorsementSystemService.endorsementListControllerFindEndorsements()
  }

  @Mutation(() => EndorsementList)
  async endorsementSystemCloseEndorsementList(
    @Args('input') input: FindEndorsementListInput,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerClose(
      input,
    )
  }

  @Mutation(() => EndorsementList)
  async endorsementSystemCreateEndorsementList(
    @Args('input') input: CreateEndorsementListDto,
  ): Promise<EndorsementList> {
    return await this.endorsementSystemService.endorsementListControllerCreate({
      endorsementListDto: input,
    })
  }
}
