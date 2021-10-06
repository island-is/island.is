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
  getValueViaPath,
} from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { parentalLeaveFormMessages } from '../lib/messages'
import Logo from '../assets/Logo'
import { isEligibleForParentalLeave } from '../lib/parentalLeaveUtils'
import { NO, YES, ParentalRelations } from '../constants'

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const PrerequisitesForm: Form = buildForm({
  id: 'ParentalLeavePrerequisites',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  stopOnFirstMissingAnswer: true,
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
                        id: 'mock.useMockData',
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
                        id: 'mock.useMockedParentalRelation',
                        title: 'Tengsl við barn:',
                        width: 'half',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES

                          return useMockData
                        },
                        options: [
                          {
                            value: ParentalRelations.primary,
                            label: 'Móðir',
                          },
                          {
                            value: ParentalRelations.secondary,
                            label: 'Hitt foreldri',
                          },
                        ],
                      }),
                      buildRadioField({
                        id: 'mock.useMockedApplication',
                        title:
                          'Use an existing application from primary parent',
                        width: 'half',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES
                          const isSecondaryParent =
                            getValueViaPath(
                              answers,
                              'mock.useMockedParentalRelation',
                            ) === ParentalRelations.secondary

                          return useMockData && isSecondaryParent
                        },
                        options: [
                          {
                            value: YES,
                            label: 'Yes',
                          },
                          {
                            value: NO,
                            label: 'No',
                          },
                        ],
                      }),
                      buildTextField({
                        id: 'mock.useMockedApplicationId',
                        title: 'Application id from primary parent',
                        placeholder: 'bf1e5775-836c-4512-abae-bdbeb8709659',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES
                          const useApplication =
                            getValueViaPath(
                              answers,
                              'mock.useMockedApplication',
                            ) === YES
                          const isSecondaryParent =
                            getValueViaPath(
                              answers,
                              'mock.useMockedParentalRelation',
                            ) === ParentalRelations.secondary

                          return (
                            useMockData && useApplication && isSecondaryParent
                          )
                        },
                      }),
                      buildTextField({
                        id: 'mock.useMockedDateOfBirth',
                        title: 'Áætlaður fæðingardagur:',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES
                          const useApplication =
                            getValueViaPath(
                              answers,
                              'mock.useMockedApplication',
                            ) === NO
                          const isPrimaryParent =
                            getValueViaPath(
                              answers,
                              'mock.useMockedParentalRelation',
                            ) === ParentalRelations.primary

                          return (
                            useMockData &&
                            ((!isPrimaryParent && useApplication) ||
                              isPrimaryParent)
                          )
                        },
                        placeholder: 'YYYY-MM-DD',
                        format: '####-##-##',
                      }),
                      buildTextField({
                        id: 'mock.useMockedPrimaryParentRights',
                        title: 'Primary parent rights days (0 — 180)',
                        variant: 'number',
                        defaultValue: '180',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES
                          const isPrimaryParent =
                            getValueViaPath(
                              answers,
                              'mock.useMockedParentalRelation',
                            ) === ParentalRelations.primary

                          return useMockData && isPrimaryParent
                        },
                      }),
                      buildTextField({
                        id: 'mock.useMockedPrimaryParentNationalRegistryId',
                        title: 'Kennitala móður:',
                        placeholder: '1234567-7890',
                        format: '######-####',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES
                          const useApplication =
                            getValueViaPath(
                              answers,
                              'mock.useMockedApplication',
                            ) === NO
                          const isSecondaryParent =
                            getValueViaPath(
                              answers,
                              'mock.useMockedParentalRelation',
                            ) === ParentalRelations.secondary

                          return (
                            useMockData && useApplication && isSecondaryParent
                          )
                        },
                      }),
                      buildTextField({
                        id: 'mock.useMockedSecondaryParentRights',
                        title: 'Secondary parent rights in days  (0 — 180)',
                        variant: 'number',
                        defaultValue: '180',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES
                          const useApplication =
                            getValueViaPath(
                              answers,
                              'mock.useMockedApplication',
                            ) === NO
                          const isSecondaryParent =
                            getValueViaPath(
                              answers,
                              'mock.useMockedParentalRelation',
                            ) === ParentalRelations.secondary

                          return (
                            useMockData && useApplication && isSecondaryParent
                          )
                        },
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
          title: parentalLeaveFormMessages.selectChild.screenTitle,
          children: [
            buildMultiField({
              id: 'selectedChildScreen',
              title: parentalLeaveFormMessages.selectChild.screenTitle,
              description:
                parentalLeaveFormMessages.selectChild.screenDescription,
              condition: (_, externalData) =>
                isEligibleForParentalLeave(externalData),
              children: [
                buildCustomField({
                  id: 'selectedChild',
                  title: parentalLeaveFormMessages.selectChild.screenTitle,
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
                      type: ParentalRelations.primary,
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
