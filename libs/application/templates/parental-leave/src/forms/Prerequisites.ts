import get from 'lodash/get'
import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import { parentalLeaveFormMessages } from '../lib/messages'
import Logo from '../assets/Logo'

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
              children: [
                buildRadioField({
                  id: 'selectedChild',
                  title: parentalLeaveFormMessages.selectChild.title,
                  width: 'full',
                  options: (application) => {
                    const children = get(
                      application.externalData,
                      'children.data',
                      [],
                    ) as {
                      id: string
                      dateOfBirth: string
                      expectedDateOfBirth: string
                    }[]

                    return children.map((child) => ({
                      value: child.id,
                      label: child.dateOfBirth
                        ? child.dateOfBirth
                        : child.expectedDateOfBirth,
                    }))
                  },
                  largeButtons: true,
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
