import {
  buildMultiField,
  buildCustomField,
  buildSubSection,
  buildAlertMessageField,
  hasYes,
  buildDescriptionField,
  YES,
} from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'
import { info } from 'kennitala'
import { m } from '../../lib/messages'
import { hasNoDrivingLicenseInOtherCountry } from '../../lib/utils'
import {
  hasHealthRemarks,
  needsHealthCertificateCondition,
} from '../../lib/utils/formUtils'
import { BE } from '../../lib/constants'

export const subSectionHealthDeclaration = buildSubSection({
  id: 'healthDeclaration',
  title: m.healthDeclarationSectionTitle,
  condition: hasNoDrivingLicenseInOtherCountry,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.healthDeclarationMultiFieldTitle,
      description: m.healthDeclarationSubTitle,
      space: 2,
      condition: (answers, externalData) => {
        if ((answers.fakeData as any).age) {
          return (answers.fakeData as any).age < 65
        }

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
          title: '',
          message: m.alertHealthDeclarationGlassesMismatch,
          alertType: 'warning',
          condition: (answers) =>
            answers.applicationFor !== BE &&
            (answers.healthDeclaration as any)?.contactGlassesMismatch,
        }),
        //TODO: Remove when RLS/SGS supports health certificate in BE license
        buildDescriptionField({
          id: 'healthDeclarationValidForBELicense',
          title: '',
        }),
        buildAlertMessageField({
          id: 'healthDeclaration.BE',
          title: '',
          message: m.beLicenseHealthDeclarationRequiresHealthCertificate,
          alertType: 'warning',
          condition: (answers, externalData) =>
            needsHealthCertificateCondition(YES)(answers, externalData),
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
        if ((answers.fakeData as any).age) {
          return (answers.fakeData as any).age >= 65
        }

        return (
          !hasYes(answers?.drivingLicenseInOtherCountry) &&
          info(
            (externalData.nationalRegistry.data as NationalRegistryUser)
              .nationalId,
          ).age >= 65
        )
      },
      children: [
        buildDescriptionField({
          id: 'healthDeclarationAge65Description',
          title: '',
          description: "Þetta view er í vinnslu",
        }),
      ],
    }),
  ],
})