import {
  buildCustomField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  hasBehaviorSchoolOrDepartmentSubType,
  hasSpecialEducationCaseManager,
  hasSpecialEducationSubType,
  hasSpecialEducationWelfareContact,
  shouldShowChildAndAdolescentPsychiatryDepartment,
  shouldShowChildAndAdolescentPsychiatryServicesReceived,
  shouldShowDiagnosticians,
  shouldShowServicesFromMunicipality,
  shouldShowSpecialists,
  shouldShowSupportNeedsAssessmentBy,
} from '../../../utils/conditionUtils'
import { CaseWorkerInputTypeEnum, OptionsType } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getDefaultSupportCaseworker,
  getDefaultYESNOValue,
  getWelfareContactDescription,
  hasDefaultSupportCaseworker,
} from '../../../utils/newPrimarySchoolUtils'

export const specialEducationSupportSubSection = buildSubSection({
  id: 'specialEducationSupportSubSection',
  title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
  condition: (answers, externalData) =>
    hasSpecialEducationSubType(answers, externalData),
  children: [
    buildMultiField({
      id: 'specialEducationSupport',
      title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .specialEducationSupportDescription,
      children: [
        // Welfare contact
        buildRadioField({
          id: 'specialEducationSupport.hasWelfareContact',
          title:
            newPrimarySchoolMessages.differentNeeds
              .specialEducationHasWelfareContact,
          description: getWelfareContactDescription,
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-welfare-contact',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-welfare-contact',
              value: NO,
            },
          ],
          defaultValue: (application: Application) =>
            hasDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            ),
        }),
        buildTextField({
          id: 'specialEducationSupport.welfareContact.name',
          title: newPrimarySchoolMessages.differentNeeds.welfareContactName,
          width: 'half',
          required: true,
          condition: hasSpecialEducationWelfareContact,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            )?.name,
        }),
        buildTextField({
          id: 'specialEducationSupport.welfareContact.email',
          title: newPrimarySchoolMessages.differentNeeds.welfareContactEmail,
          width: 'half',
          required: true,
          condition: hasSpecialEducationWelfareContact,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.SupportManager,
            )?.email,
        }),

        // Case manager
        buildRadioField({
          id: 'specialEducationSupport.hasCaseManager',
          title:
            newPrimarySchoolMessages.differentNeeds
              .specialEducationHasCaseManager,
          description:
            newPrimarySchoolMessages.differentNeeds.hasCaseManagerDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-case-manager',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-case-manager',
              value: NO,
            },
          ],
          defaultValue: (application: Application) =>
            hasDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            ),
        }),
        buildTextField({
          id: 'specialEducationSupport.caseManager.name',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerName,
          width: 'half',
          required: true,
          condition: hasSpecialEducationCaseManager,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.name,
        }),
        buildTextField({
          id: 'specialEducationSupport.caseManager.email',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
          width: 'half',
          required: true,
          condition: hasSpecialEducationCaseManager,
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.email,
        }),

        // Has integrated services
        buildRadioField({
          id: 'specialEducationSupport.hasIntegratedServices',
          title:
            newPrimarySchoolMessages.differentNeeds
              .specialEducationHasIntegratedServices,
          description:
            newPrimarySchoolMessages.differentNeeds
              .hasIntegratedServicesDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-integrated-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-integrated-services',
              value: NO,
            },
          ],
          defaultValue: (application: Application) => {
            const { socialProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(socialProfile?.hasIntegratedServices)
          },
        }),

        // Assessment of support needs
        buildRadioField({
          id: 'specialEducationSupport.hasAssessmentOfSupportNeeds',
          title:
            newPrimarySchoolMessages.differentNeeds.hasAssessmentOfSupportNeeds,
          description:
            newPrimarySchoolMessages.differentNeeds
              .hasAssessmentOfSupportNeedsDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-assessment-of-support-needs',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-assessment-of-support-needs',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'specialEducationSupport.isAssessmentOfSupportNeedsInProgress',
          title:
            newPrimarySchoolMessages.differentNeeds
              .isAssessmentOfSupportNeedsInProgress,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'is-assessment-of-support-needs-in-progress',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-is-assessment-of-support-needs-in-progress',
              value: NO,
            },
          ],
          condition: (answers) => {
            const { hasAssessmentOfSupportNeeds } =
              getApplicationAnswers(answers)

            return hasAssessmentOfSupportNeeds === NO
          },
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.supportNeedsAssessmentBy.description',
          title:
            newPrimarySchoolMessages.differentNeeds.supportNeedsAssessmentBy,
          titleVariant: 'h4',
          space: 4,
          condition: shouldShowSupportNeedsAssessmentBy,
        }),
        buildCustomField(
          {
            id: 'specialEducationSupport.supportNeedsAssessmentBy',
            title: newPrimarySchoolMessages.differentNeeds.evaluationProvider,
            component: 'FriggOptionsAsyncSelectField',
            condition: shouldShowSupportNeedsAssessmentBy,
          },
          {
            optionsType: OptionsType.ASSESSOR,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .selectWhatIsAppropriatePlaceholder,
          },
        ),

        // Confirmed diagnosis
        buildRadioField({
          id: 'specialEducationSupport.hasConfirmedDiagnosis',
          title: newPrimarySchoolMessages.differentNeeds.hasConfirmedDiagnosis,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-confirmed-diagnosis',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-confirmed-diagnosis',
              value: NO,
            },
          ],
        }),
        buildRadioField({
          id: 'specialEducationSupport.isDiagnosisInProgress',
          title: newPrimarySchoolMessages.differentNeeds.isDiagnosisInProgress,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'is-diagnosis-in-progress',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-is-diagnosis-in-progress',
              value: NO,
            },
          ],
          condition: (answers) => {
            const { hasConfirmedDiagnosis } = getApplicationAnswers(answers)

            return hasConfirmedDiagnosis === NO
          },
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.diagnosticians.description',
          title: newPrimarySchoolMessages.differentNeeds.atWhichDiagnostician,
          titleVariant: 'h4',
          space: 4,
          condition: shouldShowDiagnosticians,
        }),
        buildCustomField(
          {
            id: 'specialEducationSupport.diagnosticians',
            title: newPrimarySchoolMessages.differentNeeds.diagnostician,
            component: 'FriggOptionsAsyncSelectField',
            condition: shouldShowDiagnosticians,
          },
          {
            optionsType: OptionsType.DIAGNOSIS_SPECIALIST,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .selectAllThatAppliesPlaceholder,
            isMulti: true,
          },
        ),

        // Other specialists
        buildRadioField({
          id: 'specialEducationSupport.hasOtherSpecialists',
          title: newPrimarySchoolMessages.differentNeeds.hasOtherSpecialists,
          description:
            newPrimarySchoolMessages.differentNeeds
              .hasOtherSpecialistsDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-other-specialists',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-other-specialists',
              value: NO,
            },
          ],
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.specialists.description',
          title: newPrimarySchoolMessages.differentNeeds.atWhichSpecialist,
          titleVariant: 'h4',
          space: 4,
          condition: shouldShowSpecialists,
        }),
        buildCustomField(
          {
            id: 'specialEducationSupport.specialists',
            title: newPrimarySchoolMessages.differentNeeds.specialists,
            component: 'FriggOptionsAsyncSelectField',
            condition: shouldShowSpecialists,
          },
          {
            optionsType: OptionsType.PROFESSIONAL,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .selectAllThatAppliesPlaceholder,
            isMulti: true,
          },
        ),

        // Has received services from municipality
        buildRadioField({
          id: 'specialEducationSupport.hasReceivedServicesFromMunicipality',
          title:
            newPrimarySchoolMessages.differentNeeds
              .hasReceivedServicesFromMunicipality,
          description:
            newPrimarySchoolMessages.differentNeeds
              .hasReceivedServicesFromMunicipalityDescription,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-received-services-from-municipality',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-received-services-from-municipality',
              value: NO,
            },
          ],
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.servicesFromMunicipality.description',
          title: newPrimarySchoolMessages.differentNeeds.whichService,
          titleVariant: 'h4',
          space: 4,
          condition: shouldShowServicesFromMunicipality,
        }),
        buildCustomField(
          {
            id: 'specialEducationSupport.servicesFromMunicipality',
            title: newPrimarySchoolMessages.differentNeeds.service,
            component: 'FriggOptionsAsyncSelectField',
            condition: shouldShowServicesFromMunicipality,
          },
          {
            optionsType: OptionsType.SERVICE_CENTER,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .selectAllThatAppliesPlaceholder,
            isMulti: true,
          },
        ),

        // Has received Child and Adolescent Psychiatry services
        buildRadioField({
          id: 'specialEducationSupport.hasReceivedChildAndAdolescentPsychiatryServices',
          title:
            newPrimarySchoolMessages.differentNeeds
              .hasReceivedChildAndAdolescentPsychiatryServices,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId:
                'has-received-child-and-adolescent-psychiatry-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId:
                'no-has-received-child-and-adolescent-psychiatry-services',
              value: NO,
            },
          ],
          condition: hasBehaviorSchoolOrDepartmentSubType,
        }),
        buildRadioField({
          id: 'specialEducationSupport.isOnWaitlistForServices',
          title:
            newPrimarySchoolMessages.differentNeeds.isOnWaitlistForServices,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'is-on-waitlist-for-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-is-on-waitlist-for-services',
              value: NO,
            },
          ],
          condition: (answers, externalData) => {
            const { hasReceivedChildAndAdolescentPsychiatryServices } =
              getApplicationAnswers(answers)

            return (
              hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
              hasReceivedChildAndAdolescentPsychiatryServices === NO
            )
          },
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.childAndAdolescentPsychiatryDepartment.description',
          title:
            newPrimarySchoolMessages.differentNeeds
              .whichChildAndAdolescentPsychiatryDepartment,
          titleVariant: 'h4',
          space: 4,
          condition: shouldShowChildAndAdolescentPsychiatryDepartment,
        }),
        buildCustomField(
          {
            id: 'specialEducationSupport.childAndAdolescentPsychiatryDepartment',
            title:
              newPrimarySchoolMessages.differentNeeds
                .childAndAdolescentPsychiatryDepartment,
            component: 'FriggOptionsAsyncSelectField',
            condition: shouldShowChildAndAdolescentPsychiatryDepartment,
          },
          {
            optionsType:
              OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_DEPARTMENT,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .selectWhatIsAppropriatePlaceholder,
          },
        ),
        buildDescriptionField({
          id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived.description',
          title:
            newPrimarySchoolMessages.differentNeeds
              .childAndAdolescentPsychiatryServicesReceived,
          titleVariant: 'h4',
          space: 4,
          condition: shouldShowChildAndAdolescentPsychiatryServicesReceived,
        }),
        buildCustomField(
          {
            id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived',
            title: newPrimarySchoolMessages.differentNeeds.service,
            component: 'FriggOptionsAsyncSelectField',
            condition: shouldShowChildAndAdolescentPsychiatryServicesReceived,
          },
          {
            optionsType: OptionsType.CHILD_AND_ADOLESCENT_MENTAL_HEALTH_SERVICE,
            placeholder:
              newPrimarySchoolMessages.differentNeeds
                .selectAllThatAppliesPlaceholder,
            isMulti: true,
          },
        ),

        // Has been reported to child protective services
        buildRadioField({
          id: 'specialEducationSupport.hasBeenReportedToChildProtectiveServices',
          title:
            newPrimarySchoolMessages.differentNeeds
              .hasBeenReportedToChildProtectiveServices,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-been-reported-to-child-protective-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-been-reported-to-child-protective-services',
              value: NO,
            },
          ],
          condition: hasBehaviorSchoolOrDepartmentSubType,
        }),
        buildRadioField({
          id: 'specialEducationSupport.isCaseOpenWithChildProtectiveServices',
          title:
            newPrimarySchoolMessages.differentNeeds
              .isCaseOpenWithChildProtectiveServices,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'is-case-open-with-child-protective-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-is-case-open-with-child-protective-services',
              value: NO,
            },
          ],
          condition: (answers, externalData) => {
            const { hasBeenReportedToChildProtectiveServices } =
              getApplicationAnswers(answers)

            return (
              hasBehaviorSchoolOrDepartmentSubType(answers, externalData) &&
              hasBeenReportedToChildProtectiveServices === YES
            )
          },
        }),
        buildHiddenInput({
          id: 'specialEducationSupport.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
