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
  DefaultEvents,
  Form,
  FormModes,
  UserProfileApi,
} from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { defaultMultipleBirthsMonths } from '../config'
import {
  ADOPTION,
  OTHER_NO_CHILDREN_FOUND,
  PERMANENT_FOSTER_CARE,
  ParentalRelations,
} from '../constants'
import {
  ChildrenApi,
  GetPersonInformation,
  PreviousApplicationApi,
} from '../dataProviders'
import { errorMessages, parentalLeaveFormMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getApplicationTypeOptions,
  getChildrenOptions,
  getFosterCareOrAdoptionDesc,
  getSelectedChild,
  isChildNotInDataSelected,
  isEligibleForParentalLeave,
  isFollowUpApplication,
  isNotEligibleForParentWithoutBirthParent,
  isParentWithoutBirthParent,
} from '../lib/parentalLeaveUtils'

export const MockDataSubSection = buildSubSection({
  id: 'mockData',
  title: parentalLeaveFormMessages.shared.mockDataTitle,
  // A follow-up application inherits mock mode from the application it continues —
  // a mock predecessor has no real VMST record behind it, so the follow-up has no
  // choice in the matter. Asking here is not just redundant: the answer is
  // overwritten by `prefillFromPreviousApplication`, and an answer of "no" left on
  // the new application is what previously made it call VMST for real with a mock
  // fund id.
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
        buildDataProviderItem({
          provider: ChildrenApi,
          title: parentalLeaveFormMessages.shared.childrenInformationTitle,
          subTitle:
            parentalLeaveFormMessages.shared.childrenInformationSubTitle,
        }),
        // No title: this only resolves the application a change descends from, so
        // there is nothing to ask the applicant's consent for. It has to be listed
        // here regardless — providers not on this screen are never invoked.
        buildDataProviderItem({
          provider: PreviousApplicationApi,
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
    buildRadioField({
      id: 'noChildrenFound.typeOfApplication',
      title: parentalLeaveFormMessages.shared.noChildrenFoundTypeOfApplication,
      options: [
        {
          value: PERMANENT_FOSTER_CARE,
          label: parentalLeaveFormMessages.shared.noChildrenFoundFosterCare,
        },
        {
          value: ADOPTION,
          label: parentalLeaveFormMessages.shared.noChildrenFoundAdoption,
        },
        {
          value: OTHER_NO_CHILDREN_FOUND,
          label: parentalLeaveFormMessages.shared.noChildrenFoundOther,
        },
      ],
    }),
  ],
})

export const FosterCareOrAdoptionSubSection = buildSubSection({
  id: 'fosterCareOrAdoptionApplication',
  title: parentalLeaveFormMessages.selectChild.screenTitle,
  condition: (answers, externalData) => {
    const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(answers)

    if (
      noChildrenFoundTypeOfApplication === PERMANENT_FOSTER_CARE ||
      noChildrenFoundTypeOfApplication === ADOPTION
    ) {
      return true
    }

    // Show by default when no children and no selection yet,
    // so the next button remains visible on the previous step
    if (!noChildrenFoundTypeOfApplication && externalData?.children?.data) {
      const { children } = getApplicationExternalData(externalData)
      return children.length === 0
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

export const NoPrimaryParentSubSection = buildSubSection({
  id: 'noPrimaryParent',
  title: parentalLeaveFormMessages.shared.noPrimaryParentTitle,
  condition: (answers) => {
    const { noChildrenFoundTypeOfApplication } = getApplicationAnswers(answers)

    return noChildrenFoundTypeOfApplication === OTHER_NO_CHILDREN_FOUND
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
          options: (application) => {
            return getChildrenOptions(application)
          },
          condition: (_answers, externalData) => {
            const { children } = getApplicationExternalData(externalData)
            return children.length > 0
          },
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
          // Not asked for a child that already has an application: that answer
          // came with the application being changed and must not be contradicted
          // here. See `multipleBirths` in CARRY_OVER_ANSWER_PATHS.
          condition: (answers, externalData) => {
            const selectedChild = getSelectedChild(answers, externalData)

            return (
              !!answers.selectedChild &&
              !selectedChild?.existingApplicationId &&
              selectedChild?.parentalRelation === ParentalRelations.primary
            )
          },
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
            const selectedChild = getSelectedChild(answers, externalData)
            const { hasMultipleBirths } = getApplicationAnswers(answers)

            return (
              hasMultipleBirths === YES &&
              !selectedChild?.existingApplicationId &&
              selectedChild?.parentalRelation === ParentalRelations.primary
            )
          },
        }),
      ],
    }),
    // The applicant picked a child they have already applied for. This screen
    // creates a new application seeded from the existing one and navigates there,
    // so a change is its own application rather than a re-entry into that one.
    buildMultiField({
      id: 'startChangeApplicationScreen',
      title: '',
      // `isFollowUpApplication` is what stops this from looping: the child keeps its
      // `existingApplicationId` in the change application too, so without the guard
      // selecting it here would start yet another change application.
      condition: (answers, externalData) =>
        !isFollowUpApplication(answers) &&
        !!getSelectedChild(answers, externalData)?.existingApplicationId,
      children: [
        buildCustomField({
          id: 'startChangeApplication',
          component: 'StartChangeApplication',
          title: '',
        }),
      ],
    }),
  ],
})

export const ApplicationTypeSubSection = buildSubSection({
  id: 'applicationType',
  title: parentalLeaveFormMessages.shared.applicationTypeTitle,
  // A follow-up application skips this: the type is carried over from the
  // application it continues and must not be changeable there.
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
          title: parentalLeaveFormMessages.shared.applicationTypeTitle,
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
 * Everything the select-child and application-type screens would ask has already
 * been answered on the application this one continues, and is seeded from it on
 * exit from prerequisites. So all that is left is a submit, which routes to the
 * form for whichever action this application was created for.
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
        NoChildrenFoundSubSection,
        FosterCareOrAdoptionSubSection,
        NoPrimaryParentSubSection,
        SelectChildSubSection,
        ApplicationTypeSubSection,
        FollowUpSubSection,
      ],
    }),
  ],
})
