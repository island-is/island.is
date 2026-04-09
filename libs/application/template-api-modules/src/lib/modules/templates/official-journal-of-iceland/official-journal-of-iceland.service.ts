import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  OfficialJournalOfIcelandService,
  QueryParams,
  TypeQueryParams,
} from '@island.is/api/domains/official-journal-of-iceland'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  OJOIApplication,
  getMinistryFromSignature,
} from '@island.is/application/templates/official-journal-of-iceland'
import { OfficialJournalOfIcelandApplicationService } from '@island.is/api/domains/official-journal-of-iceland-application'
import { RegulationsAdminClientService } from '@island.is/clients/regulations-admin'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

const LOG_CATEGORY = 'official-journal-of-iceland-template-api'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: OJOIApplication
}

@Injectable()
export class OfficialJournalOfIcelandTemaplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private readonly ojoiService: OfficialJournalOfIcelandService,
    private readonly ojoiApplicationService: OfficialJournalOfIcelandApplicationService,
    private readonly regulationsAdminClient: RegulationsAdminClientService,
  ) {
    super(ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND)
  }

  async getDepartments(params: QueryParams) {
    return this.ojoiService.getDepartments(params)
  }

  async getAdvertTypes(params: TypeQueryParams) {
    return this.ojoiService.getAdvertTypes(params)
  }

  async postApplication({ application, auth }: Props): Promise<boolean> {
    try {
      return await this.ojoiApplicationService.postApplication(
        {
          id: application.id,
        },
        auth,
      )
    } catch (error) {
      return false
    }
  }

  async syncRegulationDraft({ application, auth }: Props): Promise<boolean> {
    const answers = application.answers
    const applicationType = answers?.applicationType

    // No-op for ad applications — they don't interact with the regulations DB
    if (!applicationType || applicationType === 'ad') {
      return true
    }
    try {
      const regulationType =
        applicationType === 'base_regulation' ? 'base' : 'amending'

      // The draft should already exist — it was created during the drafting
      // phase and all regulation fields + impacts live in the DB (single
      // source of truth). The draftId is the only regulation field in answers.
      const existingDraftId = answers?.regulation?.draftId

      let draftId: string

      if (existingDraftId) {
        draftId = existingDraftId
      } else {
        // Fallback: No draft was created during drafting (legacy / old app).
        // Create a new one and persist impacts from answers (if any exist).
        const draft = await this.regulationsAdminClient.create(auth, {
          type: regulationType,
        })

        if (!draft) {
          throw new Error(
            `Failed to create regulation draft for application ${application.id}`,
          )
        }

        draftId =
          typeof draft === 'object' && 'id' in draft
            ? (draft as { id: string }).id
            : String(draft)

        // Legacy path: create impacts from answers (for old apps that
        // may still have impacts stored in answers instead of DB).
        const impacts = answers?.regulation?.impacts ?? []
        for (const impact of impacts) {
          if (!impact?.type || !impact?.name) continue

          const impactDate =
            impact.date ?? answers?.regulation?.effectiveDate ?? ''

          if (impact.type === 'amend') {
            const impactAppendixes = (impact.appendixes ?? []).map(
              (a: { title?: string; text?: string }) => ({
                title: a.title ?? '',
                text: a.text ?? '',
              }),
            )

            await this.regulationsAdminClient.createDraftRegulationChange(
              {
                changingId: draftId,
                regulation: impact.name,
                date: impactDate,
                title: impact.title ?? '',
                text: impact.text ?? '',
                appendixes: impactAppendixes,
                comments: impact.comments,
                diff: impact.diff,
              },
              auth,
            )
          } else if (impact.type === 'repeal') {
            await this.regulationsAdminClient.createDraftRegulationCancel(
              {
                changingId: draftId,
                regulation: impact.name,
                date: impactDate,
              },
              auth,
            )
          }
        }
      }

      // Final step: sync OJOI-answer-sourced fields (advert title/html,
      // signature) into the regulation draft and mark as 'shipped'.
      // Regulation-specific fields (effectiveDate, lawChapters, etc.)
      // are already in the DB from the drafting phase.
      const signature = answers?.signature as Record<string, unknown>
      const { ministryName, signatureDate } =
        getMinistryFromSignature(signature)

      const decodeBase64 = (value: string): string =>
        value ? Buffer.from(value, 'base64').toString('utf-8') : ''

      const appendixes = (answers?.advert?.additions ?? []).map(
        (a: { title?: string; content?: string; html?: string }) => ({
          title: a.title ?? '',
          text: decodeBase64(a.content ?? a.html ?? ''),
        }),
      )

      await this.regulationsAdminClient.updateById(
        draftId,
        {
          draftingStatus: 'shipped',
          title: answers?.advert?.title ?? '',
          text: decodeBase64(answers?.advert?.html ?? ''),
          appendixes,
          draftingNotes: '', // Already in DB from drafting phase
          ministry: ministryName || undefined,
          signatureDate: signatureDate || undefined,
        },
        auth,
      )

      this.logger.info('Successfully synced regulation draft', {
        category: LOG_CATEGORY,
        applicationId: application.id,
        draftId,
        hadExistingDraft: !!existingDraftId,
      })

      return true
    } catch (error) {
      this.logger.error('Failed to sync regulation draft', {
        category: LOG_CATEGORY,
        applicationId: application.id,
        error,
      })
      return false
    }
  }
}
