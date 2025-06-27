import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { Application, NationalRegistryIndividual, NationalRegistrySpouse } from '@island.is/application/types'
import { applicantInformationArray } from '@island.is/application/ui-forms'

const personalInfoRoute = 'personalInfo'

export const personalInfoSubSection =
    buildSubSection({
      id: personalInfoRoute,
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
            ...applicantInformationArray({
              phoneRequired: true,
              emailRequired: false,
              emailDisabled: true,
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
