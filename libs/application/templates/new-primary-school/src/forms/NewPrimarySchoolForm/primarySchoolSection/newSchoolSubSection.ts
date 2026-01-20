import { Application, OrganizationTypeEnum, Query } from '@island.is/api/schema'
import {
  buildAlertMessageField,
  buildAsyncSelectField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
  coreErrorMessages,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { primarySchoolMessages, sharedMessages } from '../../../lib/messages'
import {
  shouldShowAlternativeSpecialEducationDepartment,
  shouldShowReasonForApplicationAndNewSchoolPages,
} from '../../../utils/conditionUtils'
import {
  NU_UNIT_ID,
  OrganizationSubType,
  RVK_MUNICIPALITY_ID,
} from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getCurrentAndNextGrade,
  getSelectedSchoolSubType,
  getSelectedSchoolUnitId,
  getSpecialEducationDepartmentsInMunicipality,
} from '../../../utils/newPrimarySchoolUtils'

export const newSchoolSubSection = buildSubSection({
  id: 'newSchoolSubSection',
  title: primarySchoolMessages.newSchool.subSectionTitle,
  condition: (answers, externalData) =>
    shouldShowReasonForApplicationAndNewSchoolPages(answers, externalData),
  children: [
    buildMultiField({
      id: 'newSchool',
      title: primarySchoolMessages.newSchool.subSectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'newSchool.municipality',
          title: sharedMessages.municipality,
          placeholder: sharedMessages.municipalityPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          setOnChange: [
            // clear answer
            {
              key: 'newSchool.alternativeSpecialEducationDepartment',
              value: [],
            },
          ],
          defaultValue: (application: Application) => {
            const { applicantMunicipalityCode } = getApplicationExternalData(
              application.externalData,
            )

            return applicantMunicipalityCode
          },
          loadOptions: async ({ apolloClient }) => {
            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.Municipality,
                },
              },
            })

            return (
              data?.friggOrganizationsByType
                ?.map(({ name, unitId }) => ({
                  value: unitId || '',
                  label: name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
        }),
        buildAsyncSelectField({
          id: 'newSchool.school',
          title: sharedMessages.school,
          placeholder: sharedMessages.schoolPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          updateOnSelect: ['newSchool.municipality'],
          loadOptions: async ({
            application,
            apolloClient,
            selectedValues,
          }) => {
            const municipalityCode = selectedValues?.[0]

            const { childGradeLevel } = getApplicationExternalData(
              application.externalData,
            )

            const { data } = await apolloClient.query<Query>({
              query: friggOrganizationsByTypeQuery,
              variables: {
                input: {
                  type: OrganizationTypeEnum.School,
                  municipalityCode: municipalityCode,
                  ...(childGradeLevel && {
                    gradeLevels: getCurrentAndNextGrade(childGradeLevel),
                  }),
                },
              },
            })

            return (
              data?.friggOrganizationsByType
                ?.map(({ id, name }) => ({
                  value: id,
                  label: name,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) ?? []
            )
          },
          condition: (answers) => {
            const { schoolMunicipality } = getApplicationAnswers(answers)

            return !!schoolMunicipality
          },
        }),
        buildAlertMessageField({
          id: 'newSchool.alertMessage',
          title: sharedMessages.alertTitle,
          message: primarySchoolMessages.newSchool.alertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginTop: 4,
          condition: (answers, externalData) => {
            const selectedSchoolId = getSelectedSchoolUnitId(
              answers,
              externalData,
            )

            return selectedSchoolId === NU_UNIT_ID
          },
        }),
        buildAlertMessageField({
          id: 'newSchool.specialSchoolOrDepartmentAlertMessage',
          title: sharedMessages.alertTitle,
          message:
            primarySchoolMessages.newSchool
              .specialSchoolOrDepartmentAlertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginTop: 4,
          condition: (answers, externalData) => {
            const selectedSchoolSubType = getSelectedSchoolSubType(
              answers,
              externalData,
            )

            return (
              selectedSchoolSubType !== '' &&
              [
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT,
                OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL,
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT,
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_SCHOOL,
              ].includes(selectedSchoolSubType)
            )
          },
        }),
        buildDescriptionField({
          id: 'newSchool.alternativeSpecialEducationDepartment.description',
          title:
            primarySchoolMessages.newSchool
              .alternativeSpecialEducationDepartmentTitle,
          titleVariant: 'h4',
          description:
            primarySchoolMessages.newSchool
              .alternativeSpecialEducationDepartmentDescription,
          condition: (answers, externalData) =>
            shouldShowAlternativeSpecialEducationDepartment(
              answers,
              externalData,
            ),
        }),
        buildFieldsRepeaterField({
          id: 'newSchool.alternativeSpecialEducationDepartment',
          formTitleNumbering: 'none',
          addItemButtonText:
            primarySchoolMessages.newSchool
              .addAlternativeSpecialEducationDepartmentButton,
          removeItemButtonText:
            primarySchoolMessages.newSchool
              .removeAlternativeSpecialEducationDepartmentButton,
          minRows: 1,
          maxRows: (answers, externalData) => {
            const { schoolMunicipality } = getApplicationAnswers(answers)

            const specialEducationDepartmentsInMunicipality =
              getSpecialEducationDepartmentsInMunicipality(
                answers,
                externalData,
              )

            // If the selected municipality is RVK and it has at least 3 departments,
            // allow 2 alternatives. Otherwise allow only 1.
            return specialEducationDepartmentsInMunicipality.length > 2 &&
              schoolMunicipality === RVK_MUNICIPALITY_ID
              ? 2
              : 1
          },
          marginTop: 0,
          condition: (answers, externalData) =>
            shouldShowAlternativeSpecialEducationDepartment(
              answers,
              externalData,
            ),
          fields: {
            department: {
              component: 'select',
              label: (index) => ({
                ...primarySchoolMessages.newSchool
                  .alternativeSpecialEducationDepartment,
                values: { index: index + 2 },
              }),
              placeholder:
                primarySchoolMessages.newSchool
                  .alternativeSpecialEducationDepartmentPlaceholder,
              isSearchable: true,
              isClearable: true,
              filterOptions: (options, answers, index) => {
                const {
                  selectedSchoolId,
                  alternativeSpecialEducationDepartment,
                } = getApplicationAnswers(answers)

                const excludedValues = alternativeSpecialEducationDepartment
                  .filter((item, idx) => idx !== index && item.department)
                  .map((item) => item.department)

                // Filter the options list to prevent the applicant from selecting the
                // same school/department more than once
                return options.filter(
                  (option) =>
                    !excludedValues.includes(option.value) &&
                    option.value !== selectedSchoolId,
                )
              },
              options: (application) =>
                getSpecialEducationDepartmentsInMunicipality(
                  application.answers,
                  application.externalData,
                )
                  ?.map(({ id, name }) => ({
                    value: id,
                    label: name,
                  }))
                  .sort((a, b) => a.label.localeCompare(b.label)) ?? [],
            },
          },
        }),
        buildHiddenInput({
          id: 'newSchool.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
