import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildAlertMessageField,
  YES,
  buildFileUploadField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  hasHealthRemarks,
  needsHealthCertificateCondition,
  hasNoDrivingLicenseInOtherCountry,
} from '../../lib/utils/formUtils'
import { License } from '../../lib/constants'

export const subSectionHealthDeclaration = buildSubSection({
  id: 'healthDeclaration',
  title: m.healthDeclarationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationSubTitle,
      condition: (answers) =>
        answers.applicationFor !== License.B_FULL_RENEWAL_65,
      space: 2,
      children: [
        buildCustomField({
          id: 'remarks',
          title: '',
          component: 'HealthRemarks',
          condition: (answers, externalData) =>
            hasHealthRemarks(externalData) &&
            answers.applicationFor !== License.BE,
        }),
        buildCustomField({
          id: 'healthDeclaration',
          title: '',
          component: 'HealthDeclaration',
        }),
        buildAlertMessageField({
          id: 'healthDeclaration.contactGlassesMismatch',
          title: '',
          message: m.alertHealthDeclarationGlassesMismatch,
          alertType: 'warning',
          condition: (answers) =>
            answers.applicationFor !== License.BE &&
            (answers.healthDeclaration as { contactGlassesMismatch: boolean })
              ?.contactGlassesMismatch,
        }),
        buildAlertMessageField({
          id: 'healthDeclarationWarning',
          title: '',
          message: m.beLicenseHealthDeclarationRequiresHealthCertificate,
          alertType: 'warning',
          condition: (answers, externalData) =>
            needsHealthCertificateCondition(YES)(answers, externalData),
        }),
        buildFileUploadField({
          id: 'healthDeclarationFileUpload',
          title: '',
          uploadDescription: m.healthDeclarationAllowedFileTypes,
          uploadAccept: '.pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx',
          uploadMultiple: false,
          condition: (answers, externalData) =>
            needsHealthCertificateCondition(YES)(answers, externalData) &&
            answers.applicationFor === License.BE,
        }),
      ],
    }),
    // Applicants older than 65 always need to provide their medical certificate
    buildMultiField({
      id: 'healthDeclarationAge65',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationMultiField65Description,
      condition: (answers) =>
        answers.applicationFor === License.B_FULL_RENEWAL_65,
      children: [
        buildFileUploadField({
          id: 'healthDeclarationFileUpload65',
          title: '',
          uploadDescription: m.healthDeclarationAllowedFileTypes,
          uploadAccept: '.pdf, .jpg, .jpeg, .png',
          uploadMultiple: false,
        }),
      ],
    }),
  ],
})
