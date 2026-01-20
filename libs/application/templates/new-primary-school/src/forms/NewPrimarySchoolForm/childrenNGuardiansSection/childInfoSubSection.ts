import {
  buildCheckboxField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  childrenNGuardiansMessages,
  sharedMessages,
} from '../../../lib/messages'
import { OptionsType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getGenderMessage,
  getSelectedChild,
} from '../../../utils/newPrimarySchoolUtils'

export const childInfoSubSection = buildSubSection({
  id: 'childInfoSubSection',
  title: childrenNGuardiansMessages.childInfo.subSectionTitle,
  children: [
    buildMultiField({
      id: 'childInfo',
      title: childrenNGuardiansMessages.childInfo.subSectionTitle,
      description: childrenNGuardiansMessages.childInfo.description,
      children: [
        buildTextField({
          id: 'childInfo.name',
          title: sharedMessages.fullName,
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.fullName,
        }),
        buildTextField({
          id: 'childInfo.nationalId',
          title: sharedMessages.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.nationalId,
        }),
        buildTextField({
          id: 'childInfo.address.streetAddress',
          title: sharedMessages.address,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'childInfo.address.postalCode',
          title: sharedMessages.postalCode,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'childInfo.address.city',
          title: sharedMessages.municipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantCity,
        }),
        buildCustomField(
          {
            id: 'childInfo.gender',
            component: 'DynamicDisabledText',
            title: sharedMessages.gender,
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
                childrenNGuardiansMessages.childInfo.usePronounAndPreferredName,
              tooltip:
                childrenNGuardiansMessages.childInfo.preferredNameTooltip,
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
          title: childrenNGuardiansMessages.childInfo.preferredName,
          doesNotRequireAnswer: true,
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
            title: childrenNGuardiansMessages.childInfo.pronouns,
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
              childrenNGuardiansMessages.childInfo.pronounsPlaceholder,
            isMulti: true,
          },
        ),
      ],
    }),
  ],
})
