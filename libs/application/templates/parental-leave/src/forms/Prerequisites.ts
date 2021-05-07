import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import { parentalLeaveFormMessages } from '../lib/messages'
import Logo from '../assets/Logo'
import { isEligibleForParentalLeave } from '../parentalLeaveUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'ParentalLeavePrerequisites',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'prerequisites',
      title: parentalLeaveFormMessages.shared.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'externalData',
          title: parentalLeaveFormMessages.shared.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: parentalLeaveFormMessages.shared.introductionProvider,
              dataProviders: [
                buildDataProviderItem({
                  id: 'userProfile',
                  type: 'UserProfileProvider',
                  title:
                    parentalLeaveFormMessages.shared
                      .userProfileInformationTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared
                      .userProfileInformationSubTitle,
                }),
                buildDataProviderItem({
                  id: 'family',
                  type: 'FamilyInformationProvider',
                  title:
                    parentalLeaveFormMessages.shared.familyInformationTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared.familyInformationSubTitle,
                }),
                buildDataProviderItem({
                  id: 'children',
                  type: 'Children',
                  title:
                    parentalLeaveFormMessages.shared.childrenInformationTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared
                      .childrenInformationSubTitle,
                }),
                buildDataProviderItem({
                  id: 'pregnancyStatusAndRights',
                  type: 'PregnancyStatusAndRights',
                  title:
                    parentalLeaveFormMessages.shared
                      .pregnancyStatusAndRightsTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared
                      .pregnancyStatusAndRightsSubtitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'selectChild',
          title: parentalLeaveFormMessages.selectChild.subSection,
          children: [
            buildMultiField({
              id: 'selectedChildScreen',
              title: parentalLeaveFormMessages.selectChild.title,
              description: parentalLeaveFormMessages.selectChild.description,
              condition: (_, externalData) =>
                isEligibleForParentalLeave(externalData),
              children: [
                buildCustomField({
                  id: 'selectedChild',
                  title: 'Veldu barn',
                  component: 'ChildSelector',
                }),
                buildSubmitField({
                  id: 'toDraft',
                  placement: 'footer',
                  title: parentalLeaveFormMessages.confirmation.title,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: 'SUBMIT',
                      name: 'Velja',
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
            buildCustomField({
              id: 'thankYou',
              title: 'Nú getur þú byrjað umsóknina',
              component: 'Conclusion',
              condition: (_, externalData) =>
                isEligibleForParentalLeave(externalData),
            }),
            // TODO: Custom component with a lot more explanation of why you may not see any children
            buildDescriptionField({
              id: 'notEligible',
              title: parentalLeaveFormMessages.selectChild.notEligibleTitle,
              description:
                parentalLeaveFormMessages.selectChild.notEligibleDescription,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'theApplicant',
      title: parentalLeaveFormMessages.shared.applicantSection,
      children: [],
    }),
    buildSection({
      id: 'rights',
      title: parentalLeaveFormMessages.shared.rightsSection,
      children: [],
    }),
    buildSection({
      id: 'leavePeriods',
      title: parentalLeaveFormMessages.shared.periodsSection,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: parentalLeaveFormMessages.confirmation.section,
      children: [],
    }),
  ],
})
