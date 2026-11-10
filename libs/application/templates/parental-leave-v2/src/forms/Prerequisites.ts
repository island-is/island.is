import {
  NO,
  YES,
  buildAlertMessageField,
  buildCustomField,
  buildDataProviderItem,
  buildDataProviderPermissionItem,
  buildDateField,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildHiddenInput,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  ExternalData,
  Form,
  FormModes,
  FormValue,
  UserProfileApi,
} from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { defaultMultipleBirthsMonths } from '../config'
import {
  ADOPTION,
  ApplicationAction,
  BIRTH,
  OTHER_NO_CHILDREN_FOUND,
  PERMANENT_FOSTER_CARE,
  ParentalRelations,
} from '../constants'
import {
  ChildrenApi,
  GetPersonInformation,
  VMSTParentalLeavesApi,
} from '../dataProviders'
import { errorMessages, parentalLeaveFormMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getApplicationTypeOptions,
  getChildrenInProgress,
  getChildrenOptions,
  getFosterCareOrAdoptionDesc,
  getSelectedChild,
  isChildNotInDataSelected,
  isEligibleForParentalLeave,
  isFollowUpApplication,
  isNoChildrenFoundPath,
  isNotEligibleForParentWithoutBirthParent,
  isParentWithoutBirthParent,
} from '../lib/parentalLeaveUtils'

// Answers of the screens behind each "Ný umsókn" type. The form keeps answers
// of screens the applicant backed out of and sends them all on submit, where
// they would fail validation, so switching child or type clears them.
const NEW_CHILD_DETAIL_ANSWERS = [
  'fosterCareOrAdoption',
  'newChildBirth',
  'noPrimaryParent',
]

const MULTIPLE_BIRTHS_ANSWERS = [
  'multipleBirths.hasMultipleBirths',
  'multipleBirths.multipleBirths',
  'multipleBirths.isAsked',
]

const buildMultipleBirthsFields = (
  condition: (answers: FormValue, externalData: ExternalData) => boolean,
) => [
  // Tells the schema the question was shown, so it can require an answer while
  // telling it apart from one cleared with the child or type. Set again after
  // every child change, which clears it with the answer.
  buildHiddenInputWithWatchedValue({
    id: 'multipleBirths.isAsked',
    watchValue: 'selectedChild',
    valueModifier: () => YES,
    defaultValue: YES,
    condition,
  }),
  buildRadioField({
    id: 'multipleBirths.hasMultipleBirths',
    title: parentalLeaveFormMessages.selectChild.multipleBirthsName,
    description:
      parentalLeaveFormMessages.selectChild.multipleBirthsDescription,
    space: 6,
    width: 'half',
    required: true,
    options: [
      {
        label: parentalLeaveFormMessages.shared.yesOptionLabel,
        dataTestId: 'has-multiple-births',
        value: YES,
      },
      {
        label: parentalLeaveFormMessages.shared.noOptionLabel,
        dataTestId: 'dont-has-multiple-births',
        value: NO,
      },
    ],
    condition,
  }),
  buildSelectField({
    id: 'multipleBirths.multipleBirths',
    title: parentalLeaveFormMessages.selectChild.multipleBirths,
    options: new Array(defaultMultipleBirthsMonths).fill(0).map((_, index) => ({
      value: `${index + 2}`,
      label: `${index + 2}`,
    })),
    width: 'half',
    condition: (answers, externalData) =>
      condition(answers, externalData) &&
      getApplicationAnswers(answers).hasMultipleBirths === YES,
  }),
]

export const MockDataSubSection = buildSubSection({
  id: 'mockData',
  title: parentalLeaveFormMessages.shared.mockDataTitle,
  // A follow-up continues a real VMST leave, so it is never mocked. Mock mode
  // only ever creates first-time applications.
  condition: (answers) => !isFollowUpApplication(answers),
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
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
            },
            {
              value: NO,
              dataTestId: 'mockdata-no',
              label: parentalLeaveFormMessages.shared.noOptionLabel,
            },
          ],
        }),
        buildRadioField({
          id: 'mock.useMockedParentalRelation',
          title: parentalLeaveFormMessages.shared.mockDataRelationship,
          width: 'half',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES

            return useMockData
          },
          options: [
            {
              value: ParentalRelations.primary,
              label: parentalLeaveFormMessages.shared.mockDataMother,
            },
            {
              value: ParentalRelations.secondary,
              label: parentalLeaveFormMessages.shared.mockDataOtherParent,
            },
          ],
        }),
        buildRadioField({
          id: 'mock.useMockedApplication',
          title: parentalLeaveFormMessages.shared.mockDataExistingApplication,
          width: 'half',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const isSecondaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.secondary

            return useMockData && isSecondaryParent
          },
          options: [
            {
              value: YES,
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
            },
            {
              value: NO,
              label: parentalLeaveFormMessages.shared.noOptionLabel,
            },
          ],
        }),
        buildRadioField({
          id: 'mock.noPrimaryParent',
          title: parentalLeaveFormMessages.shared.noChildrenFoundLabel,
          width: 'half',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const useApplication =
              getValueViaPath(answers, 'mock.useMockedApplication') === NO
            const isSecondaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.secondary

            return useMockData && useApplication && isSecondaryParent
          },
          options: [
            {
              value: YES,
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
            },
            {
              value: NO,
              label: parentalLeaveFormMessages.shared.noOptionLabel,
            },
          ],
        }),
        buildTextField({
          id: 'mock.useMockedApplicationId',
          title: parentalLeaveFormMessages.shared.mockDataApplicationID,
          placeholder: 'bf1e5775-836c-4512-abae-bdbeb8709659',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const useApplication =
              getValueViaPath(answers, 'mock.useMockedApplication') === YES
            const isSecondaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.secondary

            return useMockData && useApplication && isSecondaryParent
          },
        }),
        buildTextField({
          id: 'mock.useMockedDateOfBirth',
          title: parentalLeaveFormMessages.shared.mockDataEstimatedDateOfBirth,
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const useApplication =
              getValueViaPath(answers, 'mock.useMockedApplication') === NO
            const useNoPrimaryParent =
              getValueViaPath(answers, 'mock.noPrimaryParent') === NO
            const isPrimaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.primary

            return (
              useMockData &&
              ((!isPrimaryParent && useApplication && useNoPrimaryParent) ||
                isPrimaryParent)
            )
          },
          placeholder: 'YYYY-MM-DD',
          format: '####-##-##',
        }),
        buildTextField({
          id: 'mock.useMockedPrimaryParentRights',
          title: parentalLeaveFormMessages.shared.mockDataPrimaryParentRights,
          variant: 'number',
          defaultValue: '180',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const isPrimaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.primary

            return useMockData && isPrimaryParent
          },
        }),
        buildTextField({
          id: 'mock.useMockedPrimaryParentNationalRegistryId',
          title:
            parentalLeaveFormMessages.shared.mockDataPrimaryParentNationalID,
          placeholder: '1234567-7890',
          format: '######-####',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const useApplication =
              getValueViaPath(answers, 'mock.useMockedApplication') === NO
            const useNoPrimaryParent =
              getValueViaPath(answers, 'mock.noPrimaryParent') === NO
            const isSecondaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.secondary

            return (
              useMockData &&
              useApplication &&
              useNoPrimaryParent &&
              isSecondaryParent
            )
          },
        }),
        buildTextField({
          id: 'mock.useMockedSecondaryParentRights',
          title: parentalLeaveFormMessages.shared.mockDataSecondaryParentRights,
          variant: 'number',
          defaultValue: '180',
          condition: (answers) => {
            const useMockData =
              getValueViaPath(answers, 'mock.useMockData') === YES
            const useApplication =
              getValueViaPath(answers, 'mock.useMockedApplication') === NO
            const useNoPrimaryParent =
              getValueViaPath(answers, 'mock.noPrimaryParent') === NO
            const isSecondaryParent =
              getValueViaPath(answers, 'mock.useMockedParentalRelation') ===
              ParentalRelations.secondary

            return (
              useMockData &&
              useApplication &&
              useNoPrimaryParent &&
              isSecondaryParent
            )
          },
        }),
      ],
    }),
  ],
})

export const ExternalDataSubSection = buildSubSection({
  id: 'externalData',
  title: parentalLeaveFormMessages.shared.introductionProvider,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: parentalLeaveFormMessages.shared.introductionProvider,
      subTitle: parentalLeaveFormMessages.shared.subTitle,
      checkboxLabel: parentalLeaveFormMessages.shared.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: parentalLeaveFormMessages.shared.userProfileInformationTitle,
          subTitle:
            parentalLeaveFormMessages.shared.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: GetPersonInformation,
          title: parentalLeaveFormMessages.shared.familyInformationTitle,
          subTitle: parentalLeaveFormMessages.shared.familyInformationSubTitle,
        }),
        // Shown as part of the children's information below
        buildDataProviderItem({
          provider: VMSTParentalLeavesApi,
        }),
        buildDataProviderItem({
          provider: ChildrenApi,
          title: parentalLeaveFormMessages.shared.childrenInformationTitle,
          subTitle:
            parentalLeaveFormMessages.shared.childrenInformationSubTitle,
        }),
      ],
      otherPermissions: [
        buildDataProviderPermissionItem({
          id: 'salary',
          title: parentalLeaveFormMessages.shared.salaryInformationTitle,
          subTitle: parentalLeaveFormMessages.shared.salaryInformationSubTitle,
        }),
        buildDataProviderPermissionItem({
          id: 'taxInfo',
          title: parentalLeaveFormMessages.shared.taxInformationTitle,
          subTitle: parentalLeaveFormMessages.shared.taxInformationSubTitle,
        }),
      ],
    }),
  ],
})

export const NoChildrenFoundSubSection = buildSubSection({
  id: 'noChildrenFound',
  title: parentalLeaveFormMessages.shared.noChildrenFoundSubTitle,
  condition: (answers, externalData) => {
    // Only evaluate after data has been fetched
    if (!externalData?.children?.data) return false
    if (isChildNotInDataSelected(answers)) return true
    const { children } = getApplicationExternalData(externalData)
    return children.length === 0
  },
  children: [
    // A multi-field, not a bare radio screen: the client validates a screen
    // without child fields against every answer, so empty answers left behind
    // by a type screen the applicant backed out of would silently block "Next".
    buildMultiField({
      id: 'noChildrenFoundScreen',
      title: parentalLeaveFormMessages.shared.noChildrenFoundTypeOfApplication,
      children: [
        buildRadioField({
          id: 'noChildrenFound.typeOfApplication',
          clearOnChange: [
            ...NEW_CHILD_DETAIL_ANSWERS,
            ...MULTIPLE_BIRTHS_ANSWERS,
          ],
          options: [
            {
              value: BIRTH,
              dataTestId: 'new-child-birth',
              label: parentalLeaveFormMessages.shared.noChildrenFoundBirth,
            },
            {
              value: PERMANENT_FOSTER_CARE,
              dataTestId: 'new-child-foster-care',
              label: parentalLeaveFormMessages.shared.noChildrenFoundFosterCare,
            },
            {
              value: ADOPTION,
              dataTestId: 'new-child-adoption',
              label: parentalLeaveFormMessages.shared.noChildrenFoundAdoption,
            },
            {
              value: OTHER_NO_CHILDREN_FOUND,
              dataTestId: 'new-child-other',
              label: parentalLeaveFormMessages.shared.noChildrenFoundOther,
            },
          ],
        }),
      ],
    }),
  ],
})

export const FosterCareOrAdoptionSubSection = buildSubSection({
  id: 'fosterCareOrAdoptionApplication',
  title: parentalLeaveFormMessages.selectChild.screenTitle,
  condition: (answers, externalData) => {
    if (!isNoChildrenFoundPath(answers)) return false

    const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(answers)

    if (
      noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE ||
      noChildrenFoundTypeOfApplication === ADOPTION
    ) {
      return true
    }

    // Show by default until a type is picked, so the previous step still has a
    // screen after it and keeps its next button. The no-children-found chain is
    // reached when the registry had no children or "Ný umsókn" was picked.
    if (!noChildrenFoundTypeOfApplication && externalData?.children?.data) {
      const { children } = getApplicationExternalData(externalData)
      return children.length === 0 || isChildNotInDataSelected(answers)
    }

    return false
  },
  children: [
    buildMultiField({
      id: 'fosterCareOrAdoption',
      title: parentalLeaveFormMessages.selectChild.screenTitle,
      description: getFosterCareOrAdoptionDesc,
      children: [
        buildDateField({
          id: 'fosterCareOrAdoption.birthDate',
          title: parentalLeaveFormMessages.selectChild.fosterCareBirthDate,
          description: '',
          placeholder: parentalLeaveFormMessages.startDate.placeholder,
        }),
        buildDateField({
          id: 'fosterCareOrAdoption.adoptionDate',
          title: parentalLeaveFormMessages.selectChild.fosterCareAdoptionDate,
          description: '',
          placeholder: parentalLeaveFormMessages.startDate.placeholder,
        }),
        buildSubmitField({
          id: 'toDraft',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
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
      description: '',
    }),
  ],
})

export const NewChildBirthSubSection = buildSubSection({
  id: 'newChildBirth',
  title: parentalLeaveFormMessages.selectChild.screenTitle,
  condition: (answers) =>
    isNoChildrenFoundPath(answers) &&
    getApplicationAnswers(answers).noChildrenFoundTypeOfApplication === BIRTH,
  children: [
    buildMultiField({
      id: 'newChildBirthScreen',
      title: parentalLeaveFormMessages.selectChild.screenTitle,
      children: [
        buildDateField({
          id: 'newChildBirth.birthDate',
          title: parentalLeaveFormMessages.selectChild.newApplicationBirthDate,
          description: '',
          placeholder: parentalLeaveFormMessages.startDate.placeholder,
        }),
        // The applicant is the birth parent of a child created from these answers
        ...buildMultipleBirthsFields(() => true),
        buildSubmitField({
          id: 'toDraft',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
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
      description: '',
    }),
  ],
})

export const NoPrimaryParentSubSection = buildSubSection({
  id: 'noPrimaryParent',
  title: parentalLeaveFormMessages.shared.noPrimaryParentTitle,
  condition: (answers) => {
    const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(answers)

    return (
      isNoChildrenFoundPath(answers) &&
      noChildrenFoundTypeOfApplication === OTHER_NO_CHILDREN_FOUND
    )
  },
  children: [
    buildMultiField({
      id: 'noPrimaryParent',
      title: parentalLeaveFormMessages.shared.noPrimaryParentTitle,
      children: [
        buildRadioField({
          id: 'noPrimaryParent.questionOne',
          title: parentalLeaveFormMessages.shared.noPrimaryParentQuestionOne,
          options: [
            { value: YES, label: 'Já' },
            { value: NO, label: 'Nei' },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          id: 'noPrimaryParent.questionTwo',
          title: parentalLeaveFormMessages.shared.noPrimaryParentQuestionTwo,
          options: [
            { value: YES, label: 'Já' },
            { value: NO, label: 'Nei' },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildRadioField({
          id: 'noPrimaryParent.questionThree',
          title: parentalLeaveFormMessages.shared.noPrimaryParentQuestionThree,
          options: [
            { value: YES, label: 'Já' },
            { value: NO, label: 'Nei' },
          ],
          width: 'half',
          largeButtons: true,
        }),
        buildDateField({
          id: 'noPrimaryParent.birthDate',
          condition: (answers) => isParentWithoutBirthParent(answers),
          title:
            parentalLeaveFormMessages.shared.noPrimaryParentDatePickerTitle,
          description: '',
          placeholder: parentalLeaveFormMessages.startDate.placeholder,
        }),
        buildAlertMessageField({
          id: 'noPrimaryParent.alertMessage',
          title: errorMessages.noChildData,
          message: parentalLeaveFormMessages.shared.childrenError,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) =>
            isNotEligibleForParentWithoutBirthParent(answers),
        }),
        buildSubmitField({
          id: 'toDraft',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: parentalLeaveFormMessages.selectChild.choose,
              type: ParentalRelations.primary,
              condition: (answers) => isParentWithoutBirthParent(answers),
            },
          ],
        }),
      ],
    }),
    // Has to be here so that the submit button appears (does not appear if no screen is left).
    // Tackle that as AS task.
    buildDescriptionField({
      id: 'unused',
      description: '',
    }),
  ],
})

const isStartingChangeApplication = (
  answers: FormValue,
  externalData: ExternalData,
) =>
  !isFollowUpApplication(answers) &&
  !!getSelectedChild(answers, externalData)?.vmstApplicationId

export const SelectChildSubSection = buildSubSection({
  id: 'selectChild',
  title: parentalLeaveFormMessages.selectChild.screenTitle,
  // A follow-up application skips this entirely: its child is already decided by
  // the application it continues, and is seeded on exit from prerequisites.
  condition: (answers, externalData) => {
    if (isFollowUpApplication(answers)) return false
    if (!externalData?.children?.data) return true
    const { children } = getApplicationExternalData(externalData)
    return children.length > 0
  },
  children: [
    buildMultiField({
      id: 'selectedChildScreen',
      title: parentalLeaveFormMessages.selectChild.screenTitle,
      condition: (_, externalData) => isEligibleForParentalLeave(externalData),
      children: [
        buildRadioField({
          id: 'selectedChild',
          description: parentalLeaveFormMessages.selectChild.screenDescription,
          required: true,
          clearOnChange: [
            ...NEW_CHILD_DETAIL_ANSWERS,
            ...MULTIPLE_BIRTHS_ANSWERS,
            // Set by the change-application screen for a child already applied for
            'applicationAction',
            'initialQuery',
          ],
          options: (application) => {
            return getChildrenOptions(application)
          },
          condition: (_answers, externalData) => {
            const { children } = getApplicationExternalData(externalData)
            return children.length > 0
          },
        }),
        buildCustomField({
          id: 'inProgressApplications',
          title: '',
          component: 'InProgressApplications',
          doesNotRequireAnswer: true,
          condition: (_answers, externalData) =>
            getChildrenInProgress(externalData).length > 0,
        }),
        // Not asked for a child that already has an application: that answer
        // is prefilled from VMST for the leave being changed and must not be
        // contradicted here. See `getVMSTApplicationAnswers`.
        ...buildMultipleBirthsFields((answers, externalData) => {
          const selectedChild = getSelectedChild(answers, externalData)

          return (
            !!answers.selectedChild &&
            !selectedChild?.vmstApplicationId &&
            selectedChild?.parentalRelation === ParentalRelations.primary
          )
        }),
      ],
    }),
    // The applicant picked a child they have already applied for. Submitting
    // makes this application a change of that VMST leave, prefilled from what
    // was gathered with the external data, so VMST is not asked again.
    buildMultiField({
      id: 'startChangeApplicationScreen',
      title: parentalLeaveFormMessages.selectChild.screenTitle,
      description: parentalLeaveFormMessages.selectChild.followUpDescription,
      // `isFollowUpApplication` is what stops this from looping: the child keeps its
      // `vmstApplicationId` in the change application too, so without the guard
      // selecting it here would start yet another change application.
      condition: isStartingChangeApplication,
      children: [
        // Sent only with the submit, which persists answers on success alone,
        // so a failed start can still go back and pick another child. Picking
        // another child clears them.
        buildHiddenInput({
          id: 'applicationAction',
          defaultValue: ApplicationAction.CHANGE,
        }),
        buildHiddenInput({
          id: 'initialQuery',
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.vmstApplicationId,
        }),
        buildSubmitField({
          id: 'toChangeForm',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              dataTestId: 'start-change-application',
              name: parentalLeaveFormMessages.selectChild.choose,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    // Sibling of the multiField, not a child of it: the submit button does not
    // render unless a screen follows. Same workaround as ApplicationTypeSubSection.
    buildDescriptionField({
      id: 'startChangeApplication.unused',
      condition: isStartingChangeApplication,
      description: '',
    }),
  ],
})

export const ApplicationTypeSubSection = buildSubSection({
  id: 'applicationType',
  title: parentalLeaveFormMessages.shared.applicationTypeTitle,
  // A follow-up application skips this: the type is prefilled from VMST rights
  // for the leave it continues and must not be changeable there.
  condition: (answers, externalData) => {
    if (isFollowUpApplication(answers)) return false
    // The no-children-found chain carries its own submit, same as when the
    // registry returned no children at all.
    if (isChildNotInDataSelected(answers)) return false
    if (!externalData?.children?.data) return true
    const { children } = getApplicationExternalData(externalData)
    return children.length > 0
  },
  children: [
    buildMultiField({
      id: 'applicationTypeScreen',
      title: parentalLeaveFormMessages.shared.applicationTypeTitle,
      children: [
        buildRadioField({
          id: 'applicationType.option',
          description:
            parentalLeaveFormMessages.shared
              .applicationParentalLeaveDescription,
          options: getApplicationTypeOptions(),
        }),
        buildSubmitField({
          id: 'toDraft',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
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
      id: 'applicationType.unused',
      description: '',
    }),
  ],
})

/**
 * Prerequisites for a follow-up application — a change or a residence grant.
 *
 * Everything the select-child and application-type screens would ask is already
 * known to VMST for the leave this one continues, and is prefilled from it on
 * exit from prerequisites (`prefillFromVMST`). So all that is left is a submit,
 * which routes to the form for whichever action this application was created
 * for.
 */
export const FollowUpSubSection = buildSubSection({
  id: 'followUp',
  title: parentalLeaveFormMessages.selectChild.screenTitle,
  condition: (answers) => isFollowUpApplication(answers),
  children: [
    buildMultiField({
      id: 'followUpScreen',
      title: parentalLeaveFormMessages.selectChild.screenTitle,
      description: parentalLeaveFormMessages.selectChild.followUpDescription,
      children: [
        buildSubmitField({
          id: 'toFollowUpForm',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              dataTestId: 'continue-follow-up',
              name: parentalLeaveFormMessages.selectChild.choose,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    // Sibling of the multiField, not a child of it: the submit button does not
    // render unless a screen follows. Same workaround as ApplicationTypeSubSection.
    buildDescriptionField({
      id: 'followUp.unused',
      description: '',
    }),
  ],
})

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const PrerequisitesForm: Form = buildForm({
  id: 'ParentalLeavePrerequisites',
  title: parentalLeaveFormMessages.shared.formTitle,
  logo: DirectorateOfLabourLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: parentalLeaveFormMessages.shared.prerequisitesSection,
      children: [
        ...(shouldRenderMockDataSubSection ? [MockDataSubSection] : []),
        ExternalDataSubSection,
        // Before the no-children-found chain: picking "Ný umsókn" here leads on
        // to it, and the shell only moves forward through the form's order.
        SelectChildSubSection,
        NoChildrenFoundSubSection,
        FosterCareOrAdoptionSubSection,
        NewChildBirthSubSection,
        NoPrimaryParentSubSection,
        ApplicationTypeSubSection,
        FollowUpSubSection,
      ],
    }),
  ],
})
