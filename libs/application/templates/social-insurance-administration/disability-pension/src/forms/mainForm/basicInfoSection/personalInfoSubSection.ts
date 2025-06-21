import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildSubSection,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { Application, NationalRegistryBirthplace, NationalRegistryIndividual, NationalRegistrySpouse } from '@island.is/application/types'

const personalInfoRoute = 'personalInfoForm'

export const PersonalInfoSubSection =
    buildSubSection({
      id: 'personalInfo',
      tabTitle: disabilityPensionFormMessage.basicInfo.personalInfo,
      title: disabilityPensionFormMessage.basicInfo.personalInfo,
      children: [
        buildMultiField({
          id: personalInfoRoute,
          children: [
            buildTitleField({
              title: disabilityPensionFormMessage.basicInfo.personalInfo,
              titleVariant: 'h2',
              marginBottom: 'p2',
            }),
            buildDescriptionField({
              id: 'personalInfoInstructions',
              description: disabilityPensionFormMessage.basicInfo.personalInfoInstructions,
              marginBottom: 'containerGutter',
            }),
            buildTextField({
              id: `${personalInfoRoute}.name`,
              title: disabilityPensionFormMessage.personalInfo.name,
              disabled: true,
              backgroundColor: 'white',
              readOnly: true,
              defaultValue: (application: Application) => {
                const individual = getValueViaPath(
                  application.externalData,
                  'nationalRegistry.data',
                  undefined,
                ) as NationalRegistryIndividual | undefined

                return `${individual?.givenName} ${individual?.familyName}`
              },
            }),
            buildTextField({
              id: `${personalInfoRoute}.nationalId`,
              title: disabilityPensionFormMessage.personalInfo.nationalId,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const individual = getValueViaPath(
                  application.externalData,
                  'nationalRegistry.data',
                  undefined,
                ) as NationalRegistryIndividual | undefined

                return individual?.nationalId
              },
            }),
            buildTextField({
              id: `${personalInfoRoute}.address`,
              title: disabilityPensionFormMessage.personalInfo.address,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const individual = getValueViaPath(
                  application.externalData,
                  'nationalRegistry.data',
                  undefined,
                ) as NationalRegistryIndividual | undefined

                return individual?.address?.streetAddress
              }
            }),
            buildTextField({
              id: `${personalInfoRoute}.postcode`,
              title: disabilityPensionFormMessage.personalInfo.postcode,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const individual = getValueViaPath(
                  application.externalData,
                  'nationalRegistry.data',
                  undefined,
                ) as NationalRegistryIndividual | undefined

                return individual?.address?.postalCode
              },
            }),
            buildTextField({
              id: `${personalInfoRoute}.municipality`,
              title: disabilityPensionFormMessage.personalInfo.municipality,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const individual = getValueViaPath(
                  application.externalData,
                  'nationalRegistry.data',
                  undefined,
                ) as NationalRegistryIndividual | undefined

                return individual?.address?.locality
              },
            }),
            buildTextField({
              id: `${personalInfoRoute}.email`,
              title: disabilityPensionFormMessage.personalInfo.email,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const nationalRegistryBirthplace = getValueViaPath(
                  application.externalData,
                  'birthplace.data',
                  undefined,
                ) as NationalRegistryBirthplace | undefined

                return nationalRegistryBirthplace?.municipalityName
              },
            }),
            buildPhoneField({
              id: `${personalInfoRoute}.phone`,
              title: disabilityPensionFormMessage.personalInfo.phone,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              enableCountrySelector: true,
            }),
            buildTitleField({
              marginTop: 'containerGutter',
              title: disabilityPensionFormMessage.personalInfo.maritalStatusTitle,
              titleVariant: 'h4'
            }),
            buildTextField({
              id: `${personalInfoRoute}.maritalStatus`,
              title: disabilityPensionFormMessage.personalInfo.maritalStatus,
              disabled: true,
              backgroundColor: 'white',
              readOnly: true,
              defaultValue: (application: Application) => {
                const individual = getValueViaPath(
                  application.externalData,
                  'nationalRegistry.data',
                  undefined,
                ) as NationalRegistryIndividual | undefined

                return individual?.maritalTitle?.description
              },
            }),
            buildTextField({
              id: `${personalInfoRoute}.spouseName`,
              title: disabilityPensionFormMessage.personalInfo.spouseName,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const spouse = getValueViaPath(
                  application.externalData,
                  'nationalRegistrySpouse.data',
                  undefined,
                ) as NationalRegistrySpouse | undefined

                return spouse?.name
              },
            }),
            buildTextField({
              id: `${personalInfoRoute}.spouseNationalId`,
              title: disabilityPensionFormMessage.personalInfo.spouseNationalId,
              backgroundColor: 'white',
              disabled: true,
              readOnly: true,
              width: 'half',
              defaultValue: (application: Application) => {
                const spouse = getValueViaPath(
                  application.externalData,
                  'nationalRegistrySpouse.data',
                  undefined,
                ) as NationalRegistrySpouse | undefined

                return spouse?.nationalId
              },
            }),
          ],
        }),
      ],
    })
