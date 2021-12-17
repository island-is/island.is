import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { CreateDraftRegulationInput } from './dto/createDraftRegulation.input'
import { DeleteDraftRegulationInput } from './dto/deleteDraftRegulation.input'
import { EditDraftRegulationInput } from './dto/editDraftRegulation.input'
import { DraftRegulationModel } from './models/draftRegulation.model'
import { DeleteDraftRegulationModel } from './models/deleteDraftRegulation.model'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { RegulationsAdminApi } from '../client/regulationsAdmin.api'
import {
  Author,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
} from '@island.is/regulations/admin'
import { extractAppendixesAndComments } from '@island.is/regulations-tools/textHelpers'
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
    @CurrentUser() user: User,
  ): Promise<RegulationDraft | null> {
    const regulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      user.authorization,
    )

    if (!regulation) {
      return null
    }

    const lawChapters =
      regulation && regulation.law_chapters
        ? await this.regulationsService.getRegulationsLawChapters(
            false,
            regulation.law_chapters,
          )
        : null

    const ministries = regulation?.ministry_id
      ? await this.regulationsService.getRegulationsMinistries([
          regulation.ministry_id,
        ])
      : null

    const authors: Author[] = []
    regulation?.authors?.forEach(async (nationalId) => {
      const author = await this.regulationsAdminApiService.getAuthorInfo(
        nationalId,
        user,
      )
      author && authors.push(author)
    })

    const impacts: (DraftRegulationCancel | DraftRegulationChange)[] = []
    regulation.changes?.forEach((change) => {
      const { text, appendixes, comments } = extractAppendixesAndComments(
        regulation.text,
      )

      impacts.push({
        id: change.id,
        type: 'amend',
        title: change.title,
        text,
        name: change.regulation,
        date: change.date,
        appendixes,
        comments,
      })
    })
    if (regulation.cancel) {
      impacts.push({
        id: regulation.cancel.id,
        type: 'repeal',
        name: regulation.cancel.regulation,
        date: regulation.cancel.date,
      })
    }

    const { text, appendixes, comments } = extractAppendixesAndComments(
      regulation.text,
    )

    return {
      id: regulation.id,
      draftingStatus: regulation.drafting_status,
      title: regulation.title,
      name: regulation.name,
      text,
      lawChapters: lawChapters ?? undefined,
      ministry: ministries?.[0] ?? undefined,
      authors,
      idealPublishDate: regulation.ideal_publish_date as any, // TODO: Exclude original from response.
      draftingNotes: regulation?.drafting_notes, // TODO: Exclude original from response.
      appendixes: appendixes as RegulationAppendix[],
      comments,
      impacts,
      type: regulation.type,
      effectiveDate: regulation.effective_date,
      signatureDate: regulation.signature_date,
      signatureText: regulation.signature_text || '',
      signedDocumentUrl: regulation.signed_document_url,
      // fastTrack: ??
    }
  }

  @Query(() => [DraftRegulationModel])
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    return await this.regulationsAdminApiService.getShippedRegulations(
      authorization,
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(@CurrentUser() user: User) {
    const DBregulations = await this.regulationsAdminApiService.getDraftRegulations(
      user.authorization,
    )

    const regulations: RegulationDraft[] = []
    for await (const regulation of DBregulations) {
      const authors: Author[] = []

      if (regulation.authors) {
        for await (const nationalId of regulation.authors) {
          try {
            const author = await this.regulationsAdminApiService.getAuthorInfo(
              nationalId,
              user,
            )

            authors.push({
              authorId: nationalId,
              name: author?.name ?? '',
            })
          } catch (e) {
            // Fallback to nationalId if fetching name fails
            authors.push({
              authorId: nationalId,
              name: nationalId,
            })
          }
        }
      }

      regulations.push({
        id: regulation.id,
        draftingStatus: regulation.drafting_status,
        title: regulation.title,
        draftingNotes: regulation.drafting_notes,
        idealPublishDate: regulation.ideal_publish_date,
        signatureText: regulation.signature_text || '',
        signatureDate: regulation.signature_date,
        signedDocumentUrl: regulation.signed_document_url,
        effectiveDate: regulation.effective_date,
        type: regulation.type,
        name: regulation.name,
        // lawChapters: regulation.law_chapters,
        // ministry: regulation.ministry_id,
        // fastTrack: ???,
        impacts: [],
        authors,
        text: '',
        appendixes: [],
        comments: '',
      })
    }

    return regulations
  }

  @Mutation(() => graphqlTypeJson)
  // @Mutation(() => CreateDraftRegulationModel)
  async createDraftRegulation(
    @Args('input') input: CreateDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(input, authorization ?? '')
  }

  @Mutation(() => graphqlTypeJson)
  // @Mutation(() => CreateDraftRegulationModel)
  async updateDraftRegulationById(
    @Args('input') input: EditDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.updateById(
      input.id,
      input.body,
      authorization ?? '',
    )
  }

  @Mutation(() => DeleteDraftRegulationModel)
  async deleteDraftRegulation(
    @Args('input') input: DeleteDraftRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    await this.regulationsAdminApiService.deleteById(
      input.draftId,
      authorization ?? '',
    )

    return {
      id: input.draftId,
    }
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsMinistries(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsMinistries()
  }

  @Query(() => graphqlTypeJson)
  async getDraftRegulationsLawChapters(@CurrentUser() { authorization }: User) {
    return await this.regulationsService.getRegulationsLawChapters(false)
  }
}
