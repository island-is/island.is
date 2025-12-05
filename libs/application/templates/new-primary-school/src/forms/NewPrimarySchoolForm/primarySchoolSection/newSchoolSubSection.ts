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
  NO,
} from '@island.is/application/core'
import { friggOrganizationsByTypeQuery } from '../../../graphql/queries'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { shouldShowAlternativeSpecialEducationDepartment } from '../../../utils/conditionUtils'
import {
  ApplicationType,
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
  title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
  condition: (answers) => {
    const { applyForPreferredSchool, applicationType } =
      getApplicationAnswers(answers)

    return (
      applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
      (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
        applyForPreferredSchool === NO)
    )
  },
  children: [
    buildMultiField({
      id: 'newSchool',
      title: newPrimarySchoolMessages.primarySchool.newSchoolSubSectionTitle,
      children: [
        buildAsyncSelectField({
          id: 'newSchool.municipality',
          title: newPrimarySchoolMessages.shared.municipality,
          placeholder: newPrimarySchoolMessages.shared.municipalityPlaceholder,
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
          title: newPrimarySchoolMessages.shared.school,
          placeholder: newPrimarySchoolMessages.shared.schoolPlaceholder,
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
          title: newPrimarySchoolMessages.shared.alertTitle,
          message: newPrimarySchoolMessages.primarySchool.newSchoolAlertMessage,
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
          title: newPrimarySchoolMessages.shared.alertTitle,
          message:
            newPrimarySchoolMessages.primarySchool
              .newSchoolSpecialSchoolOrDepartmentAlertMessage,
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
            newPrimarySchoolMessages.primarySchool
              .alternativeSpecialEducationDepartmentTitle,
          titleVariant: 'h4',
          description:
            newPrimarySchoolMessages.primarySchool
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
            newPrimarySchoolMessages.primarySchool
              .addAlternativeSpecialEducationDepartmentButton,
          removeItemButtonText:
            newPrimarySchoolMessages.primarySchool
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
                ...newPrimarySchoolMessages.primarySchool
                  .alternativeSpecialEducationDepartment,
                values: { index: index + 2 },
              }),
              placeholder:
                newPrimarySchoolMessages.primarySchool
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
