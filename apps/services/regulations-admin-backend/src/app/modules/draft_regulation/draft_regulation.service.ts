import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { RegulationsService } from '@island.is/clients/regulations'
import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulationModel } from './draft_regulation.model'
import { DraftRegulationChangeModel } from '../draft_regulation_change'
import { DraftRegulationCancelModel } from '../draft_regulation_cancel'
import { Op } from 'sequelize'
import { DraftRegulationCancelService } from '../draft_regulation_cancel/draft_regulation_cancel.service'
import { DraftRegulationChangeService } from '../draft_regulation_change/draft_regulation_change.service'
import {
  Author,
  DraftRegulationCancel,
  DraftRegulationChange,
  DraftSummary,
  RegulationDraft,
} from '@island.is/regulations/admin'
import {
  combineTextAppendixesComments,
  extractAppendixesAndComments,
} from '@island.is/regulations-tools/textHelpers'
import { Appendix, Kennitala } from '@island.is/regulations'
import * as kennitala from 'kennitala'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import type { User } from '@island.is/auth-nest-tools'

@Injectable()
export class DraftRegulationService {
  constructor(
    @InjectModel(DraftRegulationModel)
    private readonly draftRegulationModel: typeof DraftRegulationModel,
    private readonly draftRegulationCancelService: DraftRegulationCancelService,
    private readonly draftRegulationChangeService: DraftRegulationChangeService,
    private readonly regulationsService: RegulationsService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly nationalRegistryApi: NationalRegistryApi,
  ) {}

  async getAll(user?: User): Promise<DraftSummary[]> {
    this.logger.debug(
      'Getting all non shipped DraftRegulations, filtered by national id for non managers',
    )
    const authorsCondition = user?.nationalId && {
      authors: { [Op.contains]: [user.nationalId] },
    }

    const draftRegulations = await this.draftRegulationModel.findAll({
      where: {
        drafting_status: { [Op.in]: ['draft', 'proposal'] },
        ...authorsCondition,
      },
      order: [
        ['drafting_status', 'ASC'],
        ['created', 'DESC'],
      ],
    })

    const drafts: DraftSummary[] = []
    for await (const draft of draftRegulations) {
      const authors: Author[] = []

      if (draft.authors) {
        for await (const nationalId of draft.authors) {
          try {
            const author = await this.getAuthorInfo(nationalId)

            author && authors.push(author)
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
        draftingStatus: draft.drafting_status as 'draft' | 'proposal',
        title: draft.title,
        idealPublishDate: draft.ideal_publish_date,
        authors,
      })
    }

    return drafts
  }

  async getAllShipped(): Promise<DraftSummary[]> {
    this.logger.debug('Getting all shipped/published DraftRegulations')

    const draftRegulations = await this.draftRegulationModel.findAll({
      where: {
        drafting_status: { [Op.in]: ['shipped', 'published'] },
      },
      order: [['created', 'DESC']],
    })

    const drafts: DraftSummary[] = []
    for await (const draft of draftRegulations) {
      drafts.push({
        id: draft.id,
        draftingStatus: draft.drafting_status as 'draft' | 'proposal',
        title: draft.title,
        idealPublishDate: draft.ideal_publish_date,
        authors: [],
      })
    }

    return drafts
  }

  async findById(id: string): Promise<RegulationDraft | null> {
    this.logger.debug(`Finding DraftRegulation ${id}`)

    const draftRegulation = await this.draftRegulationModel.findOne({
      where: { id },
      include: [
        { model: DraftRegulationChangeModel },
        { model: DraftRegulationCancelModel },
      ],
    })

    if (!draftRegulation) {
      return null
    }

    const lawChapters =
      (draftRegulation.law_chapters?.length &&
        (await this.regulationsService.getRegulationsLawChapters(
          false,
          draftRegulation.law_chapters,
        ))) ||
      undefined

    const authors: Author[] = []
    draftRegulation?.authors?.forEach(async (nationalId) => {
      try {
        const author = await this.getAuthorInfo(nationalId)

        author && authors.push(author)
      } catch (e) {
        // Fallback to nationalId if fetching name fails
        authors.push({
          authorId: nationalId,
          name: nationalId,
        })
      }
    })

    const impactNames =
      draftRegulation.changes?.map((change) => change.regulation) ?? []
    if (draftRegulation.cancel) {
      impactNames.push(draftRegulation.cancel.regulation)
    }
    const impactOptions = await this.regulationsService.getRegulationsOptionsList(
      impactNames,
    )

    const impacts: (DraftRegulationCancel | DraftRegulationChange)[] = []
    draftRegulation.changes?.forEach(async (change) => {
      const changeTexts = extractAppendixesAndComments(change.text)

      impacts.push({
        id: change.id as any,
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
    if (draftRegulation.cancel) {
      impacts.push({
        id: draftRegulation.cancel.id,
        type: 'repeal',
        date: draftRegulation.cancel.date,
        // About the cancelled reglugerð
        name: draftRegulation.cancel.regulation, // primary-key reference to the reglugerð
        regTitle:
          impactOptions.find(
            (opt) => opt.name === draftRegulation.cancel?.regulation,
          )?.title ?? '', // helpful for human-readable display in the UI
      })
    }

    const { text, appendixes, comments } = extractAppendixesAndComments(
      draftRegulation.text,
    )

    return {
      id: draftRegulation.id,
      draftingStatus: draftRegulation.drafting_status,
      title: draftRegulation.title,
      name: draftRegulation.name,
      text,
      lawChapters,
      ministry: draftRegulation.ministry,
      authors,
      idealPublishDate: draftRegulation.ideal_publish_date as any, // TODO: Exclude original from response.
      draftingNotes: draftRegulation.drafting_notes, // TODO: Exclude original from response.
      appendixes,
      comments,
      impacts,
      type: draftRegulation.type,
      effectiveDate: draftRegulation.effective_date,
      signatureDate: draftRegulation.signature_date,
      signatureText: draftRegulation.signature_text || '',
      signedDocumentUrl: draftRegulation.signed_document_url,
      fastTrack: draftRegulation.fast_track,
    }
  }

  create(
    create: CreateDraftRegulationDto,
    user?: User,
  ): Promise<DraftRegulationModel> {
    this.logger.debug('Creating a new DraftRegulation')

    const createData: Partial<DraftRegulationModel> = {
      drafting_status: 'draft',
      title: '',
      text: '',
      drafting_notes: '',
      authors: [user?.nationalId as Kennitala],
    }

    return this.draftRegulationModel.create(createData)
  }

  async update(
    id: string,
    update: UpdateDraftRegulationDto,
    user?: User,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulation: DraftRegulationModel
  }> {
    this.logger.debug(`Updating DraftRegulation ${id}`)

    const nationalId = user?.nationalId as Kennitala

    if (update.authors && !update.authors.includes(nationalId)) {
      update.authors.push(nationalId)
    }

    const updateData: Partial<DraftRegulationModel> = {
      title: update.title,
      text: combineTextAppendixesComments(
        update.text,
        update.appendixes,
        update.comments,
      ),
      ministry: update.ministry,
      drafting_notes: update.draftingNotes,
      ideal_publish_date: update.idealPublishDate,
      law_chapters: update.lawChapters,
      signature_date: update.signatureDate,
      signature_text: update.signatureText,
      effective_date: update.effectiveDate,
      type: update.type,
      drafting_status: update.draftingStatus,
      signed_document_url: update.signedDocumentUrl,
      authors: update.authors,
      fast_track: update.fastTrack,
    }

    const [
      numberOfAffectedRows,
      [updatedDraftRegulation],
    ] = await this.draftRegulationModel.update(updateData, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulation }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulation ${id}`)

    // destroy all draft regulation impacts
    await this.draftRegulationCancelService.deleteRegulationDraftCancels(id)
    await this.draftRegulationChangeService.deleteRegulationDraftChanges(id)

    return this.draftRegulationModel.destroy({
      where: {
        id,
      },
    })
  }

  async getAuthorInfo(kt: string): Promise<Author | null> {
    if (kennitala.isCompany(kt)) {
      return null
    }

    const person = await this.nationalRegistryApi.getUser(kt)

    if (!person) {
      return null
    }

    return {
      name: person.Fulltnafn,
      authorId: kt as Kennitala,
    }
  }
}
