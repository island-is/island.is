import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { Routes } from '../lib/constants'
import {
  attachments,
  general,
  advert,
  original,
  requirements,
  preview,
  publishing,
  regulation,
  summary,
  typeSelection,
} from '../lib/messages'

const isMinistry = (answers: Record<string, unknown>) => {
  const title = getValueViaPath<string>(answers, 'advert.involvedPartyTitle')
  return !!title && title.toLowerCase().includes('ráðuneyti')
}

const isAdOrDefault = (answers: Record<string, unknown>) => {
  const applicationType = getValueViaPath<string>(answers, 'applicationType')
  return !applicationType || applicationType === 'ad'
}

const isBaseRegulation = (answers: Record<string, unknown>) => {
  const applicationType = getValueViaPath<string>(answers, 'applicationType')
  return applicationType === 'base_regulation'
}

const isAmendingRegulation = (answers: Record<string, unknown>) => {
  const applicationType = getValueViaPath<string>(answers, 'applicationType')
  return applicationType === 'amending_regulation'
}

const isRegulation = (answers: Record<string, unknown>) => {
  const applicationType = getValueViaPath<string>(answers, 'applicationType')
  return (
    applicationType === 'base_regulation' ||
    applicationType === 'amending_regulation'
  )
}

export const Draft: Form = buildForm({
  id: 'OfficialJournalOfIcelandApplication',
  title: general.applicationName,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    // ── Shared: Requirements ──
    buildSection({
      id: Routes.REQUIREMENTS,
      title: requirements.general.section,
      children: [],
    }),

    // ── Shared: Type Selection (only shown for ministries) ──
    buildSection({
      id: Routes.TYPE_SELECTION,
      title: typeSelection.general.section,
      condition: isMinistry,
      children: [
        buildCustomField({
          id: 'typeSelection',
          component: 'TypeSelectionScreen',
        }),
      ],
    }),

    // ── Ad flow (unchanged) ──
    buildSection({
      id: Routes.ADVERT,
      title: advert.general.section,
      condition: isAdOrDefault,
      children: [
        buildCustomField({
          id: 'advert',
          component: 'AdvertScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.ATTACHMENTS,
      title: attachments.general.section,
      condition: isAdOrDefault,
      children: [
        buildCustomField({
          id: 'attachments',
          component: 'AttachmentsScreen',
        }),
        buildCustomField({
          id: 'supportingDocument',
          component: 'SupportingDocScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.PREVIEW,
      title: preview.general.section,
      condition: isAdOrDefault,
      children: [
        buildCustomField({
          id: 'preview',
          component: 'PreviewScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.ORIGINAL,
      title: original.general.section,
      condition: isAdOrDefault,
      children: [
        buildCustomField({
          id: 'original',
          component: 'OriginalScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.PUBLISHING,
      title: publishing.general.section,
      condition: isAdOrDefault,
      children: [
        buildCustomField({
          id: 'publishing',
          component: 'PublishingScreen',
        }),
      ],
    }),
    buildSection({
      id: Routes.SUMMARY,
      title: summary.general.section,
      condition: isAdOrDefault,
      children: [
        buildMultiField({
          id: Routes.SUMMARY,
          children: [
            buildCustomField({
              id: Routes.SUMMARY,
              component: 'SummaryScreen',
            }),
            buildSubmitField({
              id: 'toComplete',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: general.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),

    // ── Amending regulation: impacts first (title auto-generated from impacts) ──
    buildSection({
      id: `${Routes.REGULATION_IMPACTS}-amending`,
      title: regulation.impacts.general.section,
      condition: isAmendingRegulation,
      children: [
        buildCustomField({
          id: 'regulationImpacts',
          component: 'RegulationImpactsScreen',
        }),
      ],
    }),

    // ── Regulation flow: content (shown for both base and amending) ──
    buildSection({
      id: Routes.REGULATION_CONTENT,
      title: regulation.content.general.section,
      condition: isRegulation,
      children: [
        buildCustomField({
          id: 'regulationContent',
          component: 'RegulationContentScreen',
        }),
      ],
    }),

    // ── Regulation flow: attachments (viðaukar og fylgiskjöl) ──
    buildSection({
      id: Routes.REGULATION_ATTACHMENTS,
      title: attachments.general.section,
      condition: isRegulation,
      children: [
        buildCustomField({
          id: 'regulationAttachments',
          component: 'RegulationAttachmentsScreen',
        }),
        buildCustomField({
          id: 'regulationSupportingDocument',
          component: 'SupportingDocScreen',
        }),
      ],
    }),

    // ── Regulation flow: original document (reuses OJOI OriginalScreen for signed PDF upload) ──
    buildSection({
      id: `${Routes.ORIGINAL}-regulation`,
      title: original.general.section,
      condition: isRegulation,
      children: [
        buildCustomField({
          id: 'regulationOriginal',
          component: 'OriginalScreen',
        }),
      ],
    }),

    // ── Regulation flow: meta ──
    buildSection({
      id: Routes.REGULATION_META,
      title: regulation.meta.general.section,
      condition: isRegulation,
      children: [
        buildCustomField({
          id: 'regulationMeta',
          component: 'RegulationMetaScreen',
        }),
      ],
    }),

    // ── Regulation flow: preview ──
    buildSection({
      id: Routes.REGULATION_PREVIEW,
      title: regulation.preview.general.section,
      condition: isRegulation,
      children: [
        buildCustomField({
          id: 'regulationPreview',
          component: 'RegulationPreviewScreen',
        }),
      ],
    }),

    // ── Regulation flow: publishing requests ──
    buildSection({
      id: Routes.REGULATION_PUBLISHING,
      title: publishing.general.section,
      condition: isRegulation,
      children: [
        buildCustomField({
          id: 'regulationPublishing',
          component: 'RegulationPublishingScreen',
        }),
      ],
    }),

    // ── Base regulation: impacts after meta ──
    buildSection({
      id: `${Routes.REGULATION_IMPACTS}-base`,
      title: regulation.impacts.general.section,
      condition: isBaseRegulation,
      children: [
        buildCustomField({
          id: 'regulationImpacts',
          component: 'RegulationImpactsScreen',
        }),
      ],
    }),

    // ── Regulation flow: summary + submit ──
    buildSection({
      id: Routes.REGULATION_SUMMARY,
      title: regulation.summary.general.section,
      condition: isRegulation,
      children: [
        buildMultiField({
          id: Routes.REGULATION_SUMMARY,
          children: [
            buildCustomField({
              id: Routes.REGULATION_SUMMARY,
              component: 'RegulationSummaryScreen',
            }),
            buildSubmitField({
              id: 'toCompleteRegulation',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: general.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
