import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { JwtGraphQlAuthGuard } from '@island.is/judicial-system/auth'

import { BackendService } from '../backend'
import { CreateCivilClaimantInput } from './dto/createCivilClaimant.input'
import { CivilClaimant } from './models/civilClaimant.model'

@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CivilClaimant)
export class CivilClaimantResolver {
  constructor(private readonly backendService: BackendService) {}

  @Mutation(() => CivilClaimant)
  async createCivilClaimant(
    @Args('createCivilClaimantDto')
    input: CreateCivilClaimantInput,
  ): Promise<CivilClaimant> {
    const { caseId, defendantId, ...createCivilClaimant } = input

    return this.backendService.createCivilClaimant(
      caseId,
      defendantId,
      createCivilClaimant,
    )
  }
}
