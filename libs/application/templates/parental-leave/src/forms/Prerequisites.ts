import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/utils/shared'

import { parentalLeaveFormMessages } from '../lib/messages'
import Logo from '../assets/Logo'
import { isEligibleForParentalLeave } from '../parentalLeaveUtils'
import { NO, YES } from '../constants'

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

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
        ...(shouldRenderMockDataSubSection
          ? [
              buildSubSection({
                id: 'mockData',
                title: 'Gervigögn',
                children: [
                  buildMultiField({
                    id: 'shouldMock',
                    title: 'Gervigögn',
                    children: [
                      buildRadioField({
                        id: 'useMockData',
                        title: 'Viltu nota gervigögn?',
                        width: 'half',
                        options: [
                          {
                            value: YES,
                            label: 'Já',
                          },
                          {
                            value: NO,
                            label: 'Nei',
                          },
                        ],
                      }),
                      buildRadioField({
                        id: 'useMockedParentalRelation',
                        title: 'Tengsl við barn:',
                        width: 'half',
                        condition: (answers) => answers.useMockData === YES,
                        options: [
                          {
                            value: 'primary',
                            label: 'Móðir',
                          },
                          {
                            value: 'secondary',
                            label: 'Hitt foreldri',
                          },
                        ],
                      }),
                      buildTextField({
                        id: 'useMockedDateOfBirth',
                        title: 'Áætlaður fæðingardagur:',
                        condition: (answers) =>
                          answers.useMockData === YES &&
                          !!answers.useMockedParentalRelation,
                        placeholder: 'YYYY-MM-DD',
                        format: '####-##-##',
                      }),
                      buildTextField({
                        id: 'useMockedPrimaryParentNationalRegistryId',
                        title: 'Kennitala móður:',
                        condition: (answers) =>
                          answers.useMockData === YES &&
                          answers.useMockedParentalRelation === 'secondary',
                        placeholder: '1234567-7890',
                        format: '######-####',
                      }),
                    ],
                  }),
                ],
              }),
            ]
          : []),
        buildSubSection({
          id: 'externalData',
          title: parentalLeaveFormMessages.shared.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: parentalLeaveFormMessages.shared.introductionProvider,
              checkboxLabel: parentalLeaveFormMessages.shared.checkboxProvider,
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
                  title: parentalLeaveFormMessages.selectChild.subSection,
                  component: 'ChildSelector',
                }),
                buildSubmitField({
                  id: 'toDraft',
                  title: parentalLeaveFormMessages.confirmation.title,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: 'SUBMIT',
                      name: parentalLeaveFormMessages.selectChild.choose,
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
            // Has to be here so that the submit button appears (does not appear if no screen is left).
            // Tackle that as AS task.
            buildDescriptionField({
              id: 'unused',
              title: '',
              description: '',
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
