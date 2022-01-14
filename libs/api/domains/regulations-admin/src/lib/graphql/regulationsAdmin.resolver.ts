import graphqlTypeJson from 'graphql-type-json'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'
import { RegulationsService } from '@island.is/clients/regulations'
import { GetDraftRegulationInput } from './dto/getDraftRegulation.input'
import { DownloadRegulationInput } from './dto/downloadRegulation.input'
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
import {
  RegulationsAdminApi,
  RegulationsAdminOptions,
  REGULATIONS_ADMIN_OPTIONS,
} from '../client/regulationsAdmin.api'
import {
  Author,
  DraftRegulationCancel,
  DraftRegulationChange,
  RegulationDraft,
  DraftSummary,
  ShippedSummary,
  RegulationPdfDownload,
} from '@island.is/regulations/admin'
import { extractAppendixesAndComments } from '@island.is/regulations-tools/textHelpers'
import { nameToSlug, PlainText, Appendix } from '@island.is/regulations'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class RegulationsAdminResolver {
  constructor(
    private regulationsService: RegulationsService,
    private regulationsAdminApiService: RegulationsAdminApi,
    @Inject(REGULATIONS_ADMIN_OPTIONS)
    private readonly options: RegulationsAdminOptions,
  ) {}

  // @Query(() => DraftRegulationModel, { nullable: true })
  @Query(() => graphqlTypeJson)
  async getDraftRegulation(
    @Args('input') input: GetDraftRegulationInput,
    @CurrentUser() user: User,
  ): Promise<RegulationDraft | null> {
    const draft = await this.regulationsAdminApiService.getDraftRegulation(
      input.draftId,
      user.authorization,
    )

    if (!draft) {
      return null
    }

    const lawChapters =
      (draft.law_chapters?.length &&
        (await this.regulationsService.getRegulationsLawChapters(
          false,
          draft.law_chapters,
        ))) ||
      undefined

    const [ministry] =
      (await this.regulationsService.getRegulationsMinistries(
        draft.ministry_id && [draft.ministry_id],
      )) || []

    const authors: Author[] = []
    draft?.authors?.forEach(async (nationalId) => {
      const author = await this.regulationsAdminApiService.getAuthorInfo(
        nationalId,
        user,
      )
      author && authors.push(author)
    })

    const impactNames = draft.changes?.map((change) => change.regulation) ?? []
    if (draft.cancel) {
      impactNames.push(draft.cancel.regulation)
    }
    const impactOptions = await this.regulationsService.getRegulationsOptionsList(
      impactNames,
    )

    const impacts: (DraftRegulationCancel | DraftRegulationChange)[] = []
    draft.changes?.forEach(async (change) => {
      const changeTexts = extractAppendixesAndComments(change.text)

      impacts.push({
        id: change.id,
        type: 'amend',
        date: change.date,
        title: change.title,
        text: changeTexts.text,
        appendixes: changeTexts.appendixes,
        comments: changeTexts.comments,
        // About the impaced stofnreglugerð
        name: change.regulation, // primary-key reference to the stofnreglugerð
        regTitle:
          impactOptions.find((opt) => opt.name === change.regulation)?.title ??
          '', // helpful for human-readable display in the UI
      })
    })
    if (draft.cancel) {
      impacts.push({
        id: draft.cancel.id,
        type: 'repeal',
        date: draft.cancel.date,
        // About the cancelled reglugerð
        name: draft.cancel.regulation, // primary-key reference to the reglugerð
        regTitle:
          impactOptions.find((opt) => opt.name === draft.cancel?.regulation)
            ?.title ?? '', // helpful for human-readable display in the UI
      })
    }

    const { text, appendixes, comments } = extractAppendixesAndComments(
      draft.text,
    )

    return {
      id: draft.id,
      draftingStatus: draft.drafting_status,
      title: draft.title,
      name: draft.name,
      text,
      lawChapters,
      ministry,
      authors,
      idealPublishDate: draft.ideal_publish_date as any, // TODO: Exclude original from response.
      draftingNotes: draft.drafting_notes, // TODO: Exclude original from response.
      appendixes: appendixes as Appendix[],
      comments,
      impacts,
      type: draft.type,
      effectiveDate: draft.effective_date,
      signatureDate: draft.signature_date,
      signatureText: draft.signature_text || '',
      signedDocumentUrl: draft.signed_document_url,
      // fastTrack: ??
    }
  }

  @Query(() => [DraftRegulationModel])
  async getShippedRegulations(@CurrentUser() { authorization }: User) {
    const shippedRegs = await this.regulationsAdminApiService.getShippedRegulations(
      authorization,
    )
    return shippedRegs.map(
      (shipped): ShippedSummary => ({
        id: shipped.id,
        title: shipped.title,
        draftingStatus: shipped.drafting_status,
        name: shipped.name,
        idealPublishDate: shipped.ideal_publish_date,
      }),
    )
  }

  // @Query(() => [DraftRegulationModel])
  @Query(() => graphqlTypeJson)
  async getDraftRegulations(
    @CurrentUser() user: User,
  ): Promise<Array<DraftSummary>> {
    const draftRegulations = await this.regulationsAdminApiService.getDraftRegulations(
      user.authorization,
    )

    const drafts: DraftSummary[] = []
    for await (const draft of draftRegulations) {
      const authors: Author[] = []

      if (draft.authors) {
        for await (const nationalId of draft.authors) {
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
      drafts.push({
        id: draft.id,
        draftingStatus: draft.drafting_status,
        title: draft.title,
        idealPublishDate: draft.ideal_publish_date,
        authors,
      })
    }

    return drafts
  }

  @Mutation(() => graphqlTypeJson)
  // @Mutation(() => CreateDraftRegulationModel)
  async createDraftRegulation(
    @CurrentUser() { authorization }: User,
  ): Promise<any> {
    return this.regulationsAdminApiService.create(authorization ?? '')
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

  @Query(() => graphqlTypeJson)
  async downloadRegulation(
    @Args('input') input: DownloadRegulationInput,
    @CurrentUser() { authorization }: User,
  ): Promise<RegulationPdfDownload | null> {
    // This is open to be extended with downloading published regulations as well

    if (!this.options.downloadServiceUrl) {
      console.warn('no downloadservice')
      return null
    }

    const draftRegulation = await this.regulationsAdminApiService.getDraftRegulation(
      input.regulationId,
      authorization,
    )

    if (!draftRegulation) {
      return null
    }

    return {
      downloadService: true,
      url: `${this.options.downloadServiceUrl}/download/v1/regulation/draft/${input.regulationId}`,
    }
  }
}
