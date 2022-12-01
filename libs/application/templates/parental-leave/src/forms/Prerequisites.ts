import {
  buildCustomField,
  buildDataProviderItem,
  buildDataProviderPermissionItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { parentalLeaveFormMessages } from '../lib/messages'
import Logo from '../assets/Logo'
import {
  isEligibleForParentalLeave,
  getSelectedChild,
  getApplicationAnswers,
} from '../lib/parentalLeaveUtils'
import {
  NO,
  YES,
  ParentalRelations,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
} from '../constants'
import { defaultMultipleBirthsMonths } from '../config'

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const PrerequisitesForm: Form = buildForm({
  id: 'ParentalLeavePrerequisites',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: parentalLeaveFormMessages.shared.prerequisitesSection,
      children: [
        ...(shouldRenderMockDataSubSection
          ? [
              buildSubSection({
                id: 'mockData',
                title: parentalLeaveFormMessages.shared.mockDataTitle,
                children: [
                  buildMultiField({
                    id: 'shouldMock',
                    title: parentalLeaveFormMessages.shared.mockDataTitle,
                    children: [
                      buildRadioField({
                        id: 'mock.useMockData',
                        title: parentalLeaveFormMessages.shared.mockDataUse,
                        width: 'half',
                        options: [
                          {
                            value: YES,
                            dataTestId: 'mockdata-yes',
                            label:
                              parentalLeaveFormMessages.shared.yesOptionLabel,
                          },
                          {
                            value: NO,
                            dataTestId: 'mockdata-no',
                            label:
                              parentalLeaveFormMessages.shared.noOptionLabel,
                          },
                        ],
                      }),
                      buildRadioField({
                        id: 'mock.useMockedParentalRelation',
                        title:
                          parentalLeaveFormMessages.shared.mockDataRelationship,
                        width: 'half',
                        condition: (answers) => {
                          const useMockData =
                            getValueViaPath(answers, 'mock.useMockData') === YES

                          return useMockData
                        },
                        options: [
                          {
                            value: ParentalRelations.primary,
                            label:
                              parentalLeaveFormMessages.shared.mockDataMother,
                          },
                          {
                            value: ParentalRelations.secondary,
                            label:
                              parentalLeaveFormMessages.shared
                                .mockDataOtherParent,
                          },
                        ],
                      }),
                      buildRadioField({
                        id: 'mock.useMockedApplication',
                        title:
                          parentalLeaveFormMessages.shared
                            .mockDataExistingApplication,
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
                            label:
                              parentalLeaveFormMessages.shared.yesOptionLabel,
                          },
                          {
                            value: NO,
                            label:
                              parentalLeaveFormMessages.shared.noOptionLabel,
                          },
                        ],
                      }),
                      buildTextField({
                        id: 'mock.useMockedApplicationId',
                        title:
                          parentalLeaveFormMessages.shared
                            .mockDataApplicationID,
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
                        title:
                          parentalLeaveFormMessages.shared
                            .mockDataEstimatedDateOfBirth,
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
                        title:
                          parentalLeaveFormMessages.shared
                            .mockDataPrimaryParentRights,
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
                        title:
                          parentalLeaveFormMessages.shared
                            .mockDataPrimaryParentNationalID,
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
                        title:
                          parentalLeaveFormMessages.shared
                            .mockDataSecondaryParentRights,
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
          id: 'applicationType',
          title: parentalLeaveFormMessages.shared.applicationTypeTitle,
          children: [
            buildMultiField({
              id: 'applicationTypes',
              title: parentalLeaveFormMessages.shared.applicationTypeTitle,
              description:
                parentalLeaveFormMessages.shared
                  .applicationParentalLeaveDescription,
              children: [
                buildCustomField({
                  component: 'ApplicationType',
                  id: 'applicationType.option',
                  title: '',
                }),
              ],
            }),
          ],
        }),
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
                  id: 'person',
                  type: 'PersonInformationProvider',
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
              otherPermissions: [
                buildDataProviderPermissionItem({
                  id: 'salary',
                  title:
                    parentalLeaveFormMessages.shared.salaryInformationTitle,
                  subTitle:
                    parentalLeaveFormMessages.shared.salaryInformationSubTitle,
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
              condition: (_, externalData) =>
                isEligibleForParentalLeave(externalData),
              children: [
                buildCustomField({
                  id: 'selectedChild',
                  title: parentalLeaveFormMessages.selectChild.screenTitle,
                  component: 'ChildSelector',
                }),
                buildCustomField({
                  component: 'HasMultipleBirths',
                  id: 'multipleBirths.hasMultipleBirths',
                  title:
                    parentalLeaveFormMessages.selectChild.multipleBirthsName,
                  description:
                    parentalLeaveFormMessages.selectChild
                      .multipleBirthsDescription,
                  condition: (answers, externalData) =>
                    !!answers.selectedChild &&
                    getSelectedChild(answers, externalData)
                      ?.parentalRelation === ParentalRelations.primary,
                }),
                buildSelectField({
                  id: 'multipleBirths.multipleBirths',
                  title: parentalLeaveFormMessages.selectChild.multipleBirths,
                  options: new Array(defaultMultipleBirthsMonths)
                    .fill(0)
                    .map((_, index) => ({
                      value: `${index + 2}`,
                      label: `${index + 2}`,
                    })),
                  width: 'half',
                  condition: (answers, externalData) => {
                    const selectedChild =
                      getSelectedChild(answers, externalData)
                        ?.parentalRelation === ParentalRelations.primary
                    const { hasMultipleBirths } = getApplicationAnswers(answers)

                    return hasMultipleBirths === YES && selectedChild
                  },
                }),
                buildSubmitField({
                  id: 'toDraft',
                  title: parentalLeaveFormMessages.confirmation.title,
                  refetchApplicationAfterSubmit: true,
                  actions: [
                    {
                      event: 'SUBMIT',
                      dataTestId: 'select-child',
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
