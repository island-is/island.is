import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Application, NO, YES } from '@island.is/application/types'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/newPrimarySchoolUtils'

export const childInfoSubSection = buildSubSection({
  id: 'childInfoSubSection',
  title: newPrimarySchoolMessages.childrenNParents.childInfoSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childInfo',
      title: newPrimarySchoolMessages.childrenNParents.childInfoSubSectionTitle,
      description:
        newPrimarySchoolMessages.childrenNParents.childInfoDescription,
      children: [
        buildTextField({
          id: 'childInfo.name',
          title: newPrimarySchoolMessages.shared.fullName,
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .childInformation.name,
        }),
        buildTextField({
          id: 'childInfo.nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .childInformation.nationalId,
        }),
        buildTextField({
          id: 'childInfo.address.streetAddress',
          title: newPrimarySchoolMessages.shared.address,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'childInfo.address.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'childInfo.address.city',
          title: newPrimarySchoolMessages.shared.municipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantCity,
        }),
        buildTextField({
          id: 'childInfo.preferredName',
          title:
            newPrimarySchoolMessages.childrenNParents.childInfoPreferredName,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .childInformation.preferredName ?? undefined,
        }),
        buildCustomField(
          {
            id: 'childInfo.pronouns',
            title: newPrimarySchoolMessages.childrenNParents.childInfoPronouns,
            component: 'FriggOptionsAsyncSelectField',
            defaultValue: (application: Application) =>
              getApplicationExternalData(application.externalData)
                .childInformation.pronouns,
          },
          {
            optionsType: OptionsType.PRONOUN,
            placeholder:
              newPrimarySchoolMessages.childrenNParents
                .childInfoPronounsPlaceholder,
            isMulti: true,
          },
        ),
        buildRadioField({
          id: 'childInfo.differentPlaceOfResidence',
          title:
            newPrimarySchoolMessages.childrenNParents.differentPlaceOfResidence,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              value: NO,
            },
          ],
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.streetAddress',
          title:
            newPrimarySchoolMessages.childrenNParents.childInfoPlaceOfResidence,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { differentPlaceOfResidence } = getApplicationAnswers(answers)

            return differentPlaceOfResidence === YES
          },
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          format: '###',
          required: true,
          condition: (answers) => {
            const { differentPlaceOfResidence } = getApplicationAnswers(answers)

            return differentPlaceOfResidence === YES
          },
        }),
      ],
    }),
  ],
})
