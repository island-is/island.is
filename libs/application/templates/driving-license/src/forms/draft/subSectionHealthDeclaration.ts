import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildFileUploadField,
  buildAlertMessageField,
  buildDescriptionField,
  hasYes,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { hasHealthRemarks } from '../../lib/utils/formUtils'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT, YES } from '../../lib/constants'
import { NationalRegistryUser } from '@island.is/api/schema'
import { info } from 'kennitala'

export const subSectionHealthDeclaration = buildSubSection({
  id: 'healthDeclaration',
  title: m.healthDeclarationSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationMultiFieldSubTitle,
      space: 1,
      condition: (answers, externalData) => {
        return (
          !hasYes(answers?.drivingLicenseInOtherCountry) &&
          info(
            (externalData.nationalRegistry.data as NationalRegistryUser)
              .nationalId,
          ).age < 65
        )
      },
      children: [
        buildCustomField({
          id: 'remarks',
          title: '',
          component: 'HealthRemarks',
          condition: (_, externalData) => hasHealthRemarks(externalData),
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.usesContactGlasses.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration1,
          },
        ),
        buildAlertMessageField({
          id: 'healthDeclaration.contactGlassesMismatch',
          title: '',
          message:
            'Athugaðu að þar sem þú hefur/hefur ekki verið að nota gleraugu seinast, þá þarftu að skila inn vottorði frá lækninum þínum sem sýnir að þú sért/ekki að nota gleraugu.',
          alertType: 'warning',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.usesContactGlasses.mismatch,
        }),
        buildFileUploadField({
          id: 'healthDeclaration.usesContactGlasses.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.usesContactGlasses?.answer ===
              YES ||
            (answers.healthDeclaration as any)?.usesContactGlasses.mismatch,
        }),
        buildDescriptionField({
          id: 'space1',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.usesContactGlasses?.answer ===
              YES ||
            (answers.healthDeclaration as any)?.usesContactGlasses.mismatch,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.hasReducedPeripheralVision.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration2,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.hasReducedPeripheralVision.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasReducedPeripheralVision
              ?.answer === YES,
        }),
        buildDescriptionField({
          id: 'space2',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasReducedPeripheralVision
              ?.answer === YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.hasEpilepsy.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration3,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.hasEpilepsy.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasEpilepsy?.answer === YES,
        }),
        buildDescriptionField({
          id: 'space3',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasEpilepsy?.answer === YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.hasHeartDisease.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration4,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.hasHeartDisease.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasHeartDisease?.answer === YES,
        }),
        buildDescriptionField({
          id: 'space4',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasHeartDisease?.answer === YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.hasMentalIllness.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration5,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.hasMentalIllness.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasMentalIllness?.answer ===
            YES,
        }),
        buildDescriptionField({
          id: 'space5',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasMentalIllness?.answer ===
            YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.usesMedicalDrugs.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration6,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.usesMedicalDrugs.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.usesMedicalDrugs?.answer ===
            YES,
        }),
        buildDescriptionField({
          id: 'space6',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.usesMedicalDrugs?.answer ===
            YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.isAlcoholic.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration7,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.isAlcoholic.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.isAlcoholic?.answer === YES,
        }),
        buildDescriptionField({
          id: 'space7',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.isAlcoholic?.answer === YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.hasDiabetes.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration8,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.hasDiabetes.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasDiabetes?.answer === YES,
        }),
        buildDescriptionField({
          id: 'space8',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasDiabetes?.answer === YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.isDisabled.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration9,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.isDisabled.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.isDisabled?.answer === YES,
        }),
        buildDescriptionField({
          id: 'space9',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.isDisabled?.answer === YES,
        }),
        buildCustomField(
          {
            id: 'healthDeclaration.hasOtherDiseases.answer',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration10,
          },
        ),
        buildFileUploadField({
          id: 'healthDeclaration.hasOtherDiseases.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasOtherDiseases?.answer ===
            YES,
        }),
        buildDescriptionField({
          id: 'space10',
          title: '',
          marginBottom: 'containerGutter',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.hasOtherDiseases?.answer ===
            YES,
        }),
        buildAlertMessageField({
          id: 'healthDeclaration.error',
          title: '',
          message: 'Vinsamlegast fylltu út heilbringðisyfirlýsingu',
          alertType: 'error',
          condition: (answers) => !!(answers.healthDeclaration as any)?.error,
        }),
      ],
    }),
    /* Different set of the Health Declaration screen for people over the age of 65 */
    buildMultiField({
      id: 'healthDeclarationAge65',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationAge65MultiFieldSubTitle,
      space: 1,
      condition: (answers, externalData) => {
        return (
          !hasYes(answers?.drivingLicenseInOtherCountry) &&
          info(
            (externalData.nationalRegistry.data as NationalRegistryUser)
              .nationalId,
          ).age >= 65
        )
      },
      children: [
        buildFileUploadField({
          id: 'healthDeclarationAge65.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
        }),
      ],
    }),
  ],
})
