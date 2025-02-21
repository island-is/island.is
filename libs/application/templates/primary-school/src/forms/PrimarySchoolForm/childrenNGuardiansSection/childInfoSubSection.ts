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
import { primarySchoolMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getGenderMessage,
} from '../../../lib/primarySchoolUtils'

export const childInfoSubSection = buildSubSection({
  id: 'childInfoSubSection',
  title: primarySchoolMessages.childrenNGuardians.childInfoSubSectionTitle,
  children: [
    buildMultiField({
      id: 'childInfo',
      title: primarySchoolMessages.childrenNGuardians.childInfoSubSectionTitle,
      description:
        primarySchoolMessages.childrenNGuardians.childInfoDescription,
      children: [
        buildTextField({
          id: 'childInfo.name',
          title: primarySchoolMessages.shared.fullName,
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .childInformation.name,
        }),
        buildTextField({
          id: 'childInfo.nationalId',
          title: primarySchoolMessages.shared.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .childInformation.nationalId,
        }),
        buildTextField({
          id: 'childInfo.address.streetAddress',
          title: primarySchoolMessages.shared.address,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'childInfo.address.postalCode',
          title: primarySchoolMessages.shared.postalCode,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'childInfo.address.city',
          title: primarySchoolMessages.shared.municipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantCity,
        }),
        buildCustomField(
          {
            id: 'childInfo.gender',
            component: 'DynamicDisabledText',
            title: primarySchoolMessages.shared.gender,
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
                primarySchoolMessages.childrenNGuardians
                  .usePronounAndPreferredName,
            },
          ],
        }),
        buildTextField({
          id: 'childInfo.preferredName',
          title:
            primarySchoolMessages.childrenNGuardians.childInfoPreferredName,
          tooltip:
            primarySchoolMessages.childrenNGuardians.preferredNameTooltip,
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
            title: primarySchoolMessages.childrenNGuardians.childInfoPronouns,
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
              primarySchoolMessages.childrenNGuardians
                .childInfoPronounsPlaceholder,
            isMulti: true,
          },
        ),
        buildRadioField({
          id: 'childInfo.differentPlaceOfResidence',
          title:
            primarySchoolMessages.childrenNGuardians.differentPlaceOfResidence,
          description:
            primarySchoolMessages.childrenNGuardians
              .differentPlaceOfResidenceDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: primarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: primarySchoolMessages.shared.no,
              value: NO,
            },
          ],
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.streetAddress',
          title:
            primarySchoolMessages.childrenNGuardians.childInfoPlaceOfResidence,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { childInfo } = getApplicationAnswers(answers)

            return childInfo?.differentPlaceOfResidence === YES
          },
        }),
        buildTextField({
          id: 'childInfo.placeOfResidence.postalCode',
          title: primarySchoolMessages.shared.postalCode,
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
