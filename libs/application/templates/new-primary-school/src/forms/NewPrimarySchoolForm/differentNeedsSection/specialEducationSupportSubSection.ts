import {
  buildAsyncSelectField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  coreErrorMessages,
  NO,
  YES,
} from '@island.is/application/core'
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
import { ApplicationType } from '../../../utils/constants'
import { getApplicationAnswers } from '../../../utils/newPrimarySchoolUtils'

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
          // TODO: Á að setja mismunandi texta hér eftir hvort er innritun í 1 bekk eða skólaskipti?
          description: (application) => {
            const { applicationType } = getApplicationAnswers(
              application.answers,
            )

            return applicationType ===
              ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
              ? newPrimarySchoolMessages.differentNeeds
                  .hasWelfareNurserySchoolContactDescription
              : newPrimarySchoolMessages.differentNeeds
                  .hasWelfarePrimarySchoolContactDescription
          },
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
          // TODO: Add a defaultValue?
        }),
        buildTextField({
          id: 'specialEducationSupport.welfareContact.name',
          title: newPrimarySchoolMessages.differentNeeds.welfareContactName,
          width: 'half',
          required: true,
          condition: (answers) => hasSpecialEducationWelfareContact(answers),
          // TODO: Add a defaultValue?
        }),
        buildTextField({
          id: 'specialEducationSupport.welfareContact.email',
          title: newPrimarySchoolMessages.differentNeeds.welfareContactEmail,
          width: 'half',
          required: true,
          condition: (answers) => hasSpecialEducationWelfareContact(answers),
          // TODO: Add a defaultValue?
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
          // TODO: Add a defaultValue?
        }),
        buildTextField({
          id: 'specialEducationSupport.caseManager.name',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerName,
          width: 'half',
          required: true,
          condition: (answers) => hasSpecialEducationCaseManager(answers),
          // TODO: Add a defaultValue?
        }),
        buildTextField({
          id: 'specialEducationSupport.caseManager.email',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
          width: 'half',
          required: true,
          condition: (answers) => hasSpecialEducationCaseManager(answers),
          // TODO: Add a defaultValue?
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
          // TODO: Add a defaultValue?
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
          condition: (answers) => shouldShowSupportNeedsAssessmentBy(answers),
        }),
        buildAsyncSelectField({
          id: 'specialEducationSupport.supportNeedsAssessmentBy',
          title: newPrimarySchoolMessages.differentNeeds.evaluationProvider,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .selectWhatIsppropriatePlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isSearchable: true,
          loadOptions: async () => {
            // TODO: Update when data is ready
            return [
              {
                value: 'value1',
                label: 'Ráðgjafar- og greiningarstöð',
              },
              {
                value: 'value2',
                label: 'Sérfræðingar Reykjavíkurborgar',
              },
            ]
          },
          condition: (answers) => shouldShowSupportNeedsAssessmentBy(answers),
        }),

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
          condition: (answers) => shouldShowDiagnosticians(answers),
        }),
        buildAsyncSelectField({
          id: 'specialEducationSupport.diagnosticians',
          title: newPrimarySchoolMessages.differentNeeds.diagnostician,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .selectAllThatAppliesPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isClearable: true,
          isSearchable: true,
          isMulti: true,
          loadOptions: async () => {
            // TODO: Update when data is ready
            return [
              {
                value: 'value1',
                label: 'Barnaspítalinn',
              },
              {
                value: 'value2',
                label: 'BUGL',
              },
              {
                value: 'value3',
                label: 'BUGSA',
              },
              {
                value: 'value4',
                label: 'Ráðgjafar- og greiningarstöð',
              },
              {
                value: 'value5',
                label: 'Geðheilsumiðstöð barna',
              },
              {
                value: 'value6',
                label: 'SÓL',
              },
              {
                value: 'value7',
                label: 'Annað',
              },
            ]
          },
          condition: (answers) => shouldShowDiagnosticians(answers),
        }),

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
          condition: (answers) => shouldShowSpecialists(answers),
        }),
        buildAsyncSelectField({
          id: 'specialEducationSupport.specialists',
          title: newPrimarySchoolMessages.differentNeeds.specialists,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .selectAllThatAppliesPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isClearable: true,
          isSearchable: true,
          isMulti: true,
          loadOptions: async () => {
            // TODO: Update when data is ready
            return [
              {
                value: 'value1',
                label: 'Atferlisráðgjafi',
              },
              {
                value: 'value2',
                label: 'Barnageðlæknir',
              },
              {
                value: 'value3',
                label: 'Barnalæknir',
              },
              {
                value: 'value4',
                label: 'Félagsráðgjafi',
              },
              {
                value: 'value5',
                label: 'Frístundaráðgjafi',
              },
              {
                value: 'value6',
                label: 'Fötlunarráðgjafi',
              },
              {
                value: 'value7',
                label: 'Hegðunarráðgjafi',
              },
              {
                value: 'value8',
                label: 'Heimilislæknir',
              },
              {
                value: 'value9',
                label: 'Iðjuþjálfi',
              },
              {
                value: 'value10',
                label: 'Námsráðgjafi',
              },
              {
                value: 'value11',
                label: 'Sálfræðingur',
              },
              {
                value: 'value12',
                label: 'Sérkennari',
              },
              {
                value: 'value13',
                label: 'Sérkennsluráðgjafi',
              },
              {
                value: 'value14',
                label: 'Sjónráðgjafi',
              },
              {
                value: 'value15',
                label: 'Sjúkraþjálfi',
              },
              {
                value: 'value16',
                label: 'Skólahjúkrunarfræðingur',
              },
              {
                value: 'value17',
                label: 'Talmeinafræðingur',
              },
              {
                value: 'value18',
                label: 'Umferlisþjálfari',
              },
              {
                value: 'value19',
                label: 'Uppeldisráðgjafi',
              },
              {
                value: 'value20',
                label: 'Þroskaþjálfi',
              },
              {
                value: 'value21',
                label: 'Annað',
              },
            ]
          },
          condition: (answers) => shouldShowSpecialists(answers),
        }),

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
              dataTestId: 'has-has-received-services-from-municipality',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-has-received-services-from-municipality',
              value: NO,
            },
          ],
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.servicesFromMunicipality.description',
          title: newPrimarySchoolMessages.differentNeeds.whichService,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => shouldShowServicesFromMunicipality(answers),
        }),
        buildAsyncSelectField({
          id: 'specialEducationSupport.servicesFromMunicipality',
          title: newPrimarySchoolMessages.differentNeeds.service,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .selectAllThatAppliesPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isClearable: true,
          isSearchable: true,
          isMulti: true,
          loadOptions: async () => {
            // TODO: Update when data is ready
            return [
              {
                value: 'value1',
                label: 'Akstursþjónusta',
              },
              {
                value: 'value2',
                label: 'Foreldrafræðsla eða uppeldisráðgjöf s.s. PMT eða SOS',
              },
              {
                value: 'value3',
                label:
                  'Heimili fyrir börn með fötlun, þroska- og/eða geðraskanir',
              },
              {
                value: 'value4',
                label: 'Hópastarf',
              },
              {
                value: 'value5',
                label: 'Námskeið',
              },
              {
                value: 'value6',
                label: 'Persónulegur ráðgjafi eða liðveisla',
              },
              {
                value: 'value7',
                label: 'Sérhæft frístundaúrræði',
              },
              {
                value: 'value8',
                label: 'Skammtímadvöl',
              },
              {
                value: 'value9',
                label: 'Stuðningsfjölskylda',
              },
              {
                value: 'value10',
                label: 'Stuðningur heim',
              },
              {
                value: 'value11',
                label: 'Annað',
              },
            ]
          },
          condition: (answers) => shouldShowServicesFromMunicipality(answers),
        }),

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
          condition: (answers, externalData) =>
            hasBehaviorSchoolOrDepartmentSubType(answers, externalData),
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
          condition: (answers, externalData) =>
            shouldShowChildAndAdolescentPsychiatryDepartment(
              answers,
              externalData,
            ),
        }),
        buildAsyncSelectField({
          id: 'specialEducationSupport.childAndAdolescentPsychiatryDepartment',
          title:
            newPrimarySchoolMessages.differentNeeds
              .childAndAdolescentPsychiatryDepartment,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .selectWhatIsppropriatePlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isSearchable: true,
          loadOptions: async () => {
            // TODO: Update when data is ready
            return [
              {
                value: 'value1',
                label: 'Landsspítali',
              },
              {
                value: 'value2',
                label: 'Heilbrigðisstofnun Norðurlands',
              },
            ]
          },
          condition: (answers, externalData) =>
            shouldShowChildAndAdolescentPsychiatryDepartment(
              answers,
              externalData,
            ),
        }),
        buildDescriptionField({
          id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived.description',
          title:
            newPrimarySchoolMessages.differentNeeds
              .childAndAdolescentPsychiatryServicesReceived,
          titleVariant: 'h4',
          space: 4,
          condition: (answers, externalData) =>
            shouldShowChildAndAdolescentPsychiatryServicesReceived(
              answers,
              externalData,
            ),
        }),
        buildAsyncSelectField({
          id: 'specialEducationSupport.childAndAdolescentPsychiatryServicesReceived',
          title: newPrimarySchoolMessages.differentNeeds.service,
          placeholder:
            newPrimarySchoolMessages.differentNeeds
              .selectAllThatAppliesPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          isClearable: true,
          isSearchable: true,
          isMulti: true,
          loadOptions: async () => {
            // TODO: Update when data is ready
            return [
              {
                value: 'value1',
                label: 'Greining',
              },
              {
                value: 'value2',
                label: 'Innlögn',
              },
              {
                value: 'value3',
                label: 'Viðtöl',
              },
              {
                value: 'value4',
                label: 'Meðferð',
              },
              {
                value: 'value5',
                label: 'Námskeið',
              },
              {
                value: 'value6',
                label: 'Eftirlit',
              },
              {
                value: 'value7',
                label: 'Vettvangsþjónustu',
              },
              {
                value: 'value8',
                label: 'Annað',
              },
            ]
          },
          condition: (answers, externalData) =>
            shouldShowChildAndAdolescentPsychiatryServicesReceived(
              answers,
              externalData,
            ),
        }),

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
          condition: (answers, externalData) =>
            hasBehaviorSchoolOrDepartmentSubType(answers, externalData),
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
      ],
    }),
  ],
})
