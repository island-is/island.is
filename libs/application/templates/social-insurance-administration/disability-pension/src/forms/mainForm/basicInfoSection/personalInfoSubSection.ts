import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  buildTitleField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { applicantInformationArray } from '@island.is/application/ui-forms'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types/routes'
import { getApplicationExternalData } from '../../../utils'

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
          description: m.basicInfo.personalInfoInstructions,
          marginBottom: 'containerGutter',
        }),
        ...applicantInformationArray({
          phoneRequired: true,
          emailRequired: false,
          emailDisabled: true,
          postalCodeRequired: false,
          addressRequired: false,
          cityRequired: false,
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
          readOnly: true,
          defaultValue: (application: Application) => {
            const { individual } = getApplicationExternalData(
              application.externalData,
            )
            return individual?.maritalTitle?.description
          },
        }),
        buildTextField({
          id: `${SectionRouteEnum.PERSONAL_INFO}.spouseName`,
          title: m.personalInfo.spouseName,
          disabled: true,
          readOnly: true,
          width: 'half',
          condition: (_, externalData) => {
            const { spouse } = getApplicationExternalData(externalData)
            return spouse?.name !== undefined
          },
          defaultValue: (application: Application) => {
            const { spouse } = getApplicationExternalData(
              application.externalData,
            )
            return spouse?.name
          },
        }),
        buildTextField({
          id: `${SectionRouteEnum.PERSONAL_INFO}.spouseNationalId`,
          title: m.personalInfo.spouseNationalId,
          condition: (_, externalData) => {
            const { spouse } = getApplicationExternalData(externalData)
            return spouse?.nationalId !== undefined
          },
          disabled: true,
          readOnly: true,
          width: 'half',
          defaultValue: (application: Application) => {
            const { spouse } = getApplicationExternalData(
              application.externalData,
            )
            return spouse?.nationalId
          },
        }),
      ],
    }),
  ],
})
