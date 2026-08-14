import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildHiddenInput,
  YES,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { hasNoDrivingLicenseInOtherCountry } from '../../lib/utils'
import {
  hasHealthRemarks,
  needsHealthCertificateCondition,
} from '../../lib/utils/formUtils'
import { BE, B_FULL_RENEWAL_65 } from '../../lib/constants'

/**
 * The ten health questions plus the glasses-mismatch alert. Shared verbatim by
 * the B-full/B-temp block and the BE block — they were previously defined twice,
 * so changing a question meant editing both copies or silently letting one
 * product drift.
 *
 * The field ids are deliberately identical across both blocks: only one is ever
 * visible at a time (their conditions are mutually exclusive on
 * `applicationFor`), so the answers land at the same path regardless of product
 * and in-flight drafts are unaffected.
 *
 * A function rather than a shared array so each caller gets its own field
 * objects — two multifields must never hold references to the same instances.
 *
 * Note: the two 65+ blocks below deliberately do NOT use this. 65+ has no
 * questionnaire at all (per product decision it always submits a fresh health
 * certificate), so there is nothing to share.
 */
const healthDeclarationQuestions = () => [
  buildCustomField(
    {
      id: 'healthDeclaration.usesContactGlasses',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      title: m.healthDeclarationMultiFieldSubTitle,
      label: m.healthDeclaration1,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.hasReducedPeripheralVision',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration2,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.hasEpilepsy',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration3,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.hasHeartDisease',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration4,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.hasMentalIllness',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration5,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.usesMedicalDrugs',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration6,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.isAlcoholic',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration7,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.hasDiabetes',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration8,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.isDisabled',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration9,
    },
  ),
  buildCustomField(
    {
      id: 'healthDeclaration.hasOtherDiseases',
      title: '',
      component: 'HealthDeclaration',
    },
    {
      label: m.healthDeclaration10,
    },
  ),
  buildAlertMessageField({
    id: 'healthDeclaration.contactGlassesMismatch',
    message: m.alertHealthDeclarationGlassesMismatch,
    alertType: 'warning',
    condition: (answers) =>
      getValueViaPath(answers, 'healthDeclaration.contactGlassesMismatch') ===
      true,
  }),
]

export const subSectionHealthDeclaration = buildSubSection({
  id: 'healthDeclaration',
  title: m.healthDeclarationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    // Health declaration for B-temp and B-full — same questions as BE
    // but without the health certificate file upload that BE requires
    buildMultiField({
      id: 'overview',
      title: m.healthDeclarationMultiFieldTitle,
      condition: (answers) =>
        answers.applicationFor !== B_FULL_RENEWAL_65 &&
        answers.applicationFor !== BE,
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
          condition: (answers, externalData) =>
            hasHealthRemarks(externalData) && answers.applicationFor !== BE,
        }),
        ...healthDeclarationQuestions(),
      ],
    }),
    // Same health declaration questions for BE, plus health certificate
    // file upload when any health condition is triggered
    buildMultiField({
      id: 'overviewBE',
      title: m.healthDeclarationMultiFieldTitle,
      condition: (answers) => answers.applicationFor === BE,
      space: 2,
      children: [
        buildDescriptionField({
          id: 'healthDeclarationDescriptionBE',
          description: m.healthDeclarationSubTitle,
          marginBottom: 2,
        }),
        buildCustomField({
          id: 'remarksBE',
          component: 'HealthRemarks',
          condition: (_answers, externalData) => hasHealthRemarks(externalData),
        }),
        buildHiddenInput({
          id: 'hasHealthRemarks',
        }),
        ...healthDeclarationQuestions(),
        buildDescriptionField({
          id: 'healthCertificateDescriptionBE',
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
