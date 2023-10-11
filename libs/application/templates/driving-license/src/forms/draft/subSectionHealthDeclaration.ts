import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildFileUploadField,
  buildAlertMessageField,
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
      space: 2,
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
            id: 'healthDeclaration.answers.usesContactGlasses',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration1,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.hasReducedPeripheralVision',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration2,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.hasEpilepsy',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration3,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.hasHeartDisease',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration4,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.hasMentalIllness',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration5,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.usesMedicalDrugs',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration6,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.isAlcoholic',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration7,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.hasDiabetes',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration8,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.isDisabled',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration9,
          },
        ),
        buildCustomField(
          {
            id: 'healthDeclaration.answers.hasOtherDiseases',
            title: '',
            component: 'HealthDeclaration',
          },
          {
            label: m.healthDeclaration10,
          },
        ),
        buildAlertMessageField({
          id: 'healthDeclaration.error',
          title: '',
          message: 'Vinsamlegast fylltu út heilbringðisyfirlýsingu',
          alertType: 'error',
          condition: (answers) => !!(answers.healthDeclaration as any)?.error,
        }),
        buildAlertMessageField({
          id: 'healthDeclaration.contactGlassesMismatch',
          title: '',
          message:
            'Athugaðu að þar sem þú hefur/hefur ekki verið að nota gleraugu seinast, þá þarftu að skila inn vottorði frá lækninum þínum sem sýnir að þú sért/ekki að nota gleraugu.',
          alertType: 'warning',
          condition: (answers) =>
            (answers.healthDeclaration as any)?.contactGlassesMismatch,
        }),
        buildFileUploadField({
          id: 'healthDeclaration.attachment',
          title: '',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: m.attachmentMaxSizeError,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers) =>
            hasYes((answers.healthDeclaration as any)?.answers) ||
            answers.contactGlassesMismatch === true,
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
