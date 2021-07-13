import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
// import { DraftRegulationModel } from './models/draftRegulation.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client/regulationsAdmin.api'
import { RegulationDraft } from '@island.is/regulations/admin'
import { HTMLText, ISODate } from '@hugsmidjan/regulations-editor/types'
import { extractAppendixesAndComments } from '@hugsmidjan/regulations-editor/cleanupEditorOutput'
import { RegulationAppendix } from '@island.is/regulations/web'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
  ) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<RegulationDraft | null> {
    const regulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      authorization,
    )

    const lawChapters = regulation
      ? await this.regulationsService.getRegulationsLawChapters(
          false,
          regulation.law_chapters,
        )
      : null

    const ministries = regulation?.ministry
      ? await this.regulationsService.getRegulationsMinistries([
          regulation.ministry,
        ])
      : null

    if (!regulation) {
      return null
    }

    const { text, appendixes, comments } = extractAppendixesAndComments(
      regulation.text,
    );

    return {
      id: regulation.id,
      draftingStatus: regulation.drafting_status,
      title: regulation.title,
      name: regulation.name,
      text: text as HTMLText,
      lawChapters: lawChapters ?? undefined,
      ministry: ministries?.[0] ?? undefined,
      authors: [
        // TODO: Sækja úr X-road
        regulation?.authors?.map((authorKt, idx) => ({
          authorId: authorKt,
          name: 'Test name' + idx,
        })) as any,
      ],
      idealPublishDate: regulation.ideal_publish_date as any, // TODO: Exclude original from response.
      draftingNotes: regulation?.drafting_notes, // TODO: Exclude original from response.
      appendixes: appendixes as RegulationAppendix[],
      comments: comments as HTMLText,
      impacts: [], // TODO: Add this.
    }
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminApiService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() { authorization }: User) {
    const regulations = await this.regulationsAdminApiService.getDraftRegulations(
      authorization,
    )

    return regulations
  }
}
