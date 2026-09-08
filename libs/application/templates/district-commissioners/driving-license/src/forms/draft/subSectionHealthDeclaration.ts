import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildHiddenInput,
  buildRadioField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { hasNoDrivingLicenseInOtherCountry } from '../../utils'
import {
  hasContactGlassesMismatch,
  hasHealthRemarks,
  needsHealthCertificateCondition,
} from '../../utils/formUtils'
import { B_FULL_RENEWAL_65 } from '../../utils/constants'

const yesNoOptions = [
  { value: YES, label: m.yes },
  { value: NO, label: m.no },
]

// A plain yes/no radio for one health question. All ten questions are identical
// apart from their id and label. The text goes in `title` (rendered as a plain
// h5) rather than `description`: the questions are numbered ("1. …", "2. …") and
// `description` runs through Markdown, which parses a leading "N." as an
// ordered-list item and restyles/renumbers it.
const healthQuestion = (
  id: string,
  label: (typeof m)['healthDeclaration1'],
) =>
  buildRadioField({
    id,
    title: label,
    titleVariant: 'h5',
    width: 'half',
    largeButtons: false,
    space: 2,
    options: yesNoOptions,
  })

/**
 * The ten health questions plus the glasses-mismatch alert.
 *
 * The glasses-mismatch alert derives its visibility from the vision answers via
 * `hasContactGlassesMismatch`, so the questions themselves are plain radio
 * fields with no side effects.
 *
 * Note: the two 65+ blocks below deliberately do NOT use this. 65+ has no
 * questionnaire at all (per product decision it always submits a fresh health
 * certificate), so there is nothing to share.
 */
const healthDeclarationQuestions = () => [
  buildDescriptionField({
    id: 'healthDeclarationSubTitle',
    title: m.healthDeclarationMultiFieldSubTitle,
    titleVariant: 'h5',
    marginBottom: 2,
  }),
  healthQuestion('healthDeclaration.usesContactGlasses', m.healthDeclaration1),
  healthQuestion(
    'healthDeclaration.hasReducedPeripheralVision',
    m.healthDeclaration2,
  ),
  healthQuestion('healthDeclaration.hasEpilepsy', m.healthDeclaration3),
  healthQuestion('healthDeclaration.hasHeartDisease', m.healthDeclaration4),
  healthQuestion('healthDeclaration.hasMentalIllness', m.healthDeclaration5),
  healthQuestion('healthDeclaration.usesMedicalDrugs', m.healthDeclaration6),
  healthQuestion('healthDeclaration.isAlcoholic', m.healthDeclaration7),
  healthQuestion('healthDeclaration.hasDiabetes', m.healthDeclaration8),
  healthQuestion('healthDeclaration.isDisabled', m.healthDeclaration9),
  healthQuestion('healthDeclaration.hasOtherDiseases', m.healthDeclaration10),
  buildAlertMessageField({
    id: 'healthDeclaration.contactGlassesMismatch',
    message: m.alertHealthDeclarationGlassesMismatch,
    alertType: 'warning',
    condition: hasContactGlassesMismatch,
  }),
]

/**
 * The certificate description plus the conditional upload. The upload appears
 * only once a health condition is triggered (a "yes" answer, a health remark, or
 * a glasses code on the current license) — see `needsHealthCertificateCondition`.
 *
 * The 65+ redesigned block deliberately does not use this — its upload is
 * unconditional, so the shared gate would be wrong.
 */
const healthCertificateFields = () => [
  buildDescriptionField({
    id: 'healthCertificateDescription',
    description: m.healthCertificateDescription,
    condition: needsHealthCertificateCondition(YES),
  }),
  buildFileUploadField({
    id: 'healthCertificate',
    title: m.healthCertificateTitle,
    uploadHeader: m.healthCertificateUploadHeader,
    uploadDescription: m.healthCertificateUploadDescription,
    uploadButtonLabel: m.healthCertificateUploadButtonLabel,
    maxSize: 4000000,
    uploadAccept: '.pdf, .jpg, .jpeg, .png',
    condition: needsHealthCertificateCondition(YES),
  }),
]

export const subSectionHealthDeclaration = buildSubSection({
  id: 'healthDeclaration',
  title: m.healthDeclarationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    // Health declaration for B-temp and B-full — the questions plus the
    // conditional certificate upload
    buildMultiField({
      id: 'overview',
      title: m.healthDeclarationMultiFieldTitle,
      condition: (answers) => answers.applicationFor !== B_FULL_RENEWAL_65,
      space: 2,
      children: [
        buildDescriptionField({
          id: 'healthDeclarationDescription',
          description: m.healthDeclarationSubTitle,
          marginBottom: 2,
        }),
        buildCustomField({
          id: 'remarks',
          component: 'HealthRemarks',
          condition: (_answers, externalData) => hasHealthRemarks(externalData),
        }),
        buildHiddenInput({
          id: 'hasHealthRemarks',
        }),
        ...healthDeclarationQuestions(),
        ...healthCertificateFields(),
      ],
    }),
    // 65+ multifield (legacy) — flag OFF
    buildMultiField({
      id: 'healthDeclarationAge65',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationMultiField65Description,
      condition: (answers) =>
        answers.applicationFor === B_FULL_RENEWAL_65 &&
        getValueViaPath(answers, 'is65RenewalRedesignEnabled') !== true,
      children: [
        buildDescriptionField({
          id: 'healthDeclarationDescription65',
          description: m.healthDeclarationMultiField65Description,
        }),
      ],
    }),
    // 65+ multifield (redesigned) — flag ON. Description + mandatory cert
    // upload. No health questions (per product decision: 65+ always submits
    // a fresh health certificate, no per-condition questionnaire).
    buildMultiField({
      id: 'healthDeclarationAge65Redesigned',
      title: m.healthDeclarationMultiFieldTitle,
      condition: (answers) =>
        answers.applicationFor === B_FULL_RENEWAL_65 &&
        getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true,
      space: 2,
      children: [
        buildDescriptionField({
          id: 'healthDeclarationDescription65Redesigned',
          description: m.healthDeclarationMultiField65DescriptionRedesigned,
          marginBottom: 2,
        }),
        buildFileUploadField({
          id: 'healthCertificate',
          title: m.healthCertificateTitle,
          uploadHeader: m.healthCertificateUploadHeader,
          uploadDescription: m.healthCertificateUploadDescription,
          uploadButtonLabel: m.healthCertificateUploadButtonLabel,
          maxSize: 4000000,
          uploadAccept: '.pdf, .jpg, .jpeg, .png',
        }),
      ],
    }),
  ],
})
