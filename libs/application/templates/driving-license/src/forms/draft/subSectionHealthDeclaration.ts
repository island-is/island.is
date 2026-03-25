import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
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
            getValueViaPath(
              answers,
              'healthDeclaration.contactGlassesMismatch',
            ) === true,
        }),
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
            getValueViaPath(
              answers,
              'healthDeclaration.contactGlassesMismatch',
            ) === true,
        }),
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
          maxSize: 10000000,
          uploadAccept: '.pdf, .jpg, .jpeg, .png',
          condition: needsHealthCertificateCondition(YES),
        }),
      ],
    }),
    // 65+ multifield — unchanged
    buildMultiField({
      id: 'healthDeclarationAge65',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationMultiField65Description,
      condition: (answers) => answers.applicationFor === B_FULL_RENEWAL_65,
      children: [
        buildDescriptionField({
          id: 'healthDeclarationDescription65',
          description: m.healthDeclarationMultiField65Description,
        }),
      ],
    }),
  ],
})
