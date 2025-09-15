import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import { applicantInformationArray } from '@island.is/application/ui-forms'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const personalInfoSubSection = buildSubSection({
  id: SectionRouteEnum.PERSONAL_INFO,
  tabTitle: m.basicInfo.personalInfo,
  title: m.basicInfo.personalInfo,
  children: [
    buildMultiField({
      id: SectionRouteEnum.PERSONAL_INFO,
      title: m.basicInfo.personalInfo,
      children: [
        buildDescriptionField({
          id: 'personalInfoInstructions',
          description:
            m.basicInfo.personalInfoInstructions,
          marginBottom: 'containerGutter',
        }),
        ...applicantInformationArray({
          phoneRequired: true,
          emailRequired: false,
          emailDisabled: true,
          customAddressLabel: m.personalInfo.address,
        }),
        buildTitleField({
          marginTop: 'containerGutter',
          title: m.personalInfo.maritalStatusTitle,
          titleVariant: 'h4',
        }),
        buildTextField({
          id: `${SectionRouteEnum.PERSONAL_INFO}.maritalStatus`,
          title: m.personalInfo.maritalStatus,
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
          id: `${SectionRouteEnum.PERSONAL_INFO}.spouseName`,
          title: m.personalInfo.spouseName,
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
          id: `${SectionRouteEnum.PERSONAL_INFO}.spouseNationalId`,
          title: m.personalInfo.spouseNationalId,
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
