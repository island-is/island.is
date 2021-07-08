import { Query, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { DraftRegulationModel } from './models/draftRegulation.model'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client/regulationsAdmin.api'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(private RegulationsAdminApiService: RegulationsAdminApi) {}

  @Query(() => DraftRegulationModel, { nullable: true })
  async getDraftRegulation(@Args('input') input: GetDraftRegulationInput) {
    return this.RegulationsAdminApiService.getDraftRegulation(
      input.regulationId,
    )
  }
}
