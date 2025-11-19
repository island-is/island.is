import {
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { OptionsType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getGenderMessage,
  getSelectedChild,
} from '../../../utils/newPrimarySchoolUtils'

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
            getSelectedChild(application.answers, application.externalData)
              ?.fullName,
        }),
        buildTextField({
          id: 'childInfo.nationalId',
          title: newPrimarySchoolMessages.shared.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.nationalId,
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
            value: (application: Application) =>
              getGenderMessage(application.answers, application.externalData),
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
          defaultValue: (application: Application) => {
            const { childInformation } = getApplicationExternalData(
              application.externalData,
            )
            return (childInformation?.pronouns?.length ?? 0) > 0 ||
              !!childInformation?.preferredName
              ? [YES]
              : []
          },
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
              .childInformation?.preferredName ?? undefined,
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
                .childInformation?.pronouns,
          },
          {
            optionsType: OptionsType.PRONOUN,
            placeholder:
              newPrimarySchoolMessages.childrenNGuardians
                .childInfoPronounsPlaceholder,
            isMulti: true,
          },
        ),
      ],
    }),
  ],
})
