import {
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { OptionsType } from '../../../lib/constants'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getGenderMessage,
  getSelectedChild,
} from '../../../lib/newPrimarySchoolUtils'

export const childInfoSubSection = buildSubSection({
  id: 'childInfoSubSection',
  title: newPrimarySchoolMessages.childrenNGuardians.childInfoSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childInfo',
      title:
        newPrimarySchoolMessages.childrenNGuardians.childInfoSubSectionTitle,
      description:
        newPrimarySchoolMessages.childrenNGuardians.childInfoDescription,
      children: [
        buildTextField({
          id: 'childInfo.name',
          title: newPrimarySchoolMessages.shared.fullName,
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application)?.fullName,
        }),
        buildTextField({
          id: 'childInfo.nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application)?.nationalId,
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
        buildCustomField(
          {
            id: 'childInfo.gender',
            component: 'DynamicDisabledText',
            title: newPrimarySchoolMessages.shared.gender,
          },
          {
            value: (application: Application) => getGenderMessage(application),
          },
        ),
        buildCheckboxField({
          id: 'childInfo.usePronounAndPreferredName',
          spacing: 0,
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.childrenNGuardians
                  .usePronounAndPreferredName,
              tooltip:
                newPrimarySchoolMessages.childrenNGuardians
                  .preferredNameTooltip,
            },
          ],
        }),
        buildTextField({
          id: 'childInfo.preferredName',
          title:
            newPrimarySchoolMessages.childrenNGuardians.childInfoPreferredName,
          condition: (answers) => {
            const { childInfo } = getApplicationAnswers(answers)

            return !!childInfo?.usePronounAndPreferredName?.includes(YES)
          },
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .childInformation.preferredName ?? undefined,
        }),
        buildCustomField(
          {
            id: 'childInfo.pronouns',
            title:
              newPrimarySchoolMessages.childrenNGuardians.childInfoPronouns,
            condition: (answers) => {
              const { childInfo } = getApplicationAnswers(answers)

              return !!childInfo?.usePronounAndPreferredName?.includes(YES)
            },
            component: 'FriggOptionsAsyncSelectField',
            defaultValue: (application: Application) =>
              getApplicationExternalData(application.externalData)
                .childInformation.pronouns,
          },
          {
            optionsType: OptionsType.PRONOUN,
            placeholder:
              newPrimarySchoolMessages.childrenNGuardians
                .childInfoPronounsPlaceholder,
            isMulti: true,
          },
        ),
        buildRadioField({
          id: 'childInfo.differentPlaceOfResidence',
          title:
            newPrimarySchoolMessages.childrenNGuardians
              .differentPlaceOfResidence,
          description:
            newPrimarySchoolMessages.childrenNGuardians
              .differentPlaceOfResidenceDescription,
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
            newPrimarySchoolMessages.childrenNGuardians
              .childInfoPlaceOfResidence,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { childInfo } = getApplicationAnswers(answers)

            return childInfo?.differentPlaceOfResidence === YES
          },
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.postalCode',
          title: newPrimarySchoolMessages.shared.postalCode,
          width: 'half',
          format: '###',
          required: true,
          condition: (answers) => {
            const { childInfo } = getApplicationAnswers(answers)

            return childInfo?.differentPlaceOfResidence === YES
          },
        }),
      ],
    }),
  ],
})
