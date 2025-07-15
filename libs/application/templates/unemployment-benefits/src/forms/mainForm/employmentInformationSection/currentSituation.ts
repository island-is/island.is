import {
  buildAlertMessageField,
  buildDateField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'
import { EmploymentStatus } from '../../../shared'
import {
  getEmploymentFromRsk,
  hasEmployer,
  isEmployed,
  isEmployedPartTime,
  isOccasionallyEmployed,
} from '../../../utils'

export const currentSituationSubSection = buildSubSection({
  id: 'currentSituationSubSection',
  title: employmentMessages.currentSituation.general.sectionTitle,
  children: [
    //TODO setja alla reiti required
    buildMultiField({
      id: 'currentSituationSubSection',
      title: employmentMessages.currentSituation.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'currentSituation.description',
          title:
            employmentMessages.currentSituation.labels
              .currentSituationDropdownDescription,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'currentSituation.status',
          title:
            employmentMessages.currentSituation.labels
              .currentSituationDropdownLabel,
          backgroundColor: 'blue',
          required: true,
          options: [
            {
              value: EmploymentStatus.UNEMPLOYED,
              label:
                employmentMessages.currentSituation.labels.statusOptionNoJob,
            },
            {
              value: EmploymentStatus.PARTJOB,
              label: employmentMessages.currentSituation.labels.statusPartJob,
            },
            {
              value: EmploymentStatus.OCCASIONAL,
              label:
                employmentMessages.currentSituation.labels.statusOccasionalJob,
            },
            {
              value: EmploymentStatus.EMPLOYED,
              label:
                employmentMessages.currentSituation.labels
                  .statusCurrentlyEmployed,
            },
          ],
        }),
        buildDescriptionField({
          id: 'currentjobDescription',
          title: {
            id: employmentMessages.currentSituation.labels.jobRepeaterEmployment
              .id,
            values: { index: 1 },
          },
          titleVariant: 'h5',
          marginTop: 2,
          condition: hasEmployer,
        }),
        buildSelectField({
          id: 'currentSituation.currentJob.nationalIdWithName',
          required: true,
          title:
            employmentMessages.currentSituation.labels
              .partTimeJobEmployerCombination,
          options: (application) => {
            const employmentList = getEmploymentFromRsk(
              application.externalData,
            )
            return employmentList.map((job) => ({
              value: job.employerSSN ?? '',
              label:
                job.employerSSN !== '-'
                  ? `${job.employer}, ${job.employerSSN}`
                  : job.employer,
            }))
          },
          condition: (answers, externalData) => {
            const employmentList = getEmploymentFromRsk(externalData)
            return employmentList.length > 0 && hasEmployer(answers)
          },
        }),
        buildNationalIdWithNameField({
          id: 'currentSituation.currentJob.employer',
          searchCompanies: true,
          searchPersons: false,
          required: true,
          condition: (answers, externalData) => {
            const nationalIdChosen =
              getValueViaPath<string>(
                answers,
                'currentSituation.currentJob.nationalIdWithName',
                '',
              ) ?? ''
            return nationalIdChosen === '-' && hasEmployer(answers)
          },
        }),
        buildTextField({
          id: 'currentSituation.currentJob.percentage',
          title:
            employmentMessages.currentSituation.labels.partTimeJobPercentage,
          width: 'half',
          variant: 'number',
          suffix: '%',
          required: true,
          condition: hasEmployer,
        }),
        buildDateField({
          id: 'currentSituation.currentJob.startDate',
          width: 'half',
          title:
            employmentMessages.currentSituation.labels.partTimeJobStartDate,
          maxDate: new Date(),
          required: true,
          condition: isEmployedPartTime,
        }),
        buildTextField({
          id: 'currentSituation.currentJob.workHours',
          width: 'half',
          title:
            employmentMessages.currentSituation.labels.partTimeJobWorkHours,
          required: true,
          condition: isEmployedPartTime,
        }),
        buildTextField({
          id: 'currentSituation.currentJob.salary',
          width: 'half',
          variant: 'currency',
          title: employmentMessages.currentSituation.labels.partTimeJobSalary,
          required: true,
          condition: isEmployedPartTime,
        }),
        buildDateField({
          id: 'currentSituation.currentJob.endDate',
          width: 'half',
          title: employmentMessages.currentSituation.labels.jobEndDate,
          //TODO ef meira en 2 vikur þá kemur viðvörunargluggi
          minDate: new Date(),
          required: true,
          condition: isEmployed,
        }),
        buildFieldsRepeaterField({
          id: 'currentSituation.currentSituationRepeater',
          minRows: 0,
          marginTop: 0,
          formTitle: (index) => {
            return {
              id: employmentMessages.currentSituation.labels
                .jobRepeaterEmployment.id,
              values: { index: index + 1 },
            }
          },
          formTitleVariant: 'h5',
          formTitleNumbering: 'none',
          width: 'full',
          condition: isEmployedPartTime,
          addItemButtonText: employmentMessages.employmentHistory.labels.addJob,
          fields: {
            nationalIdWithName: {
              component: 'select',
              label:
                employmentMessages.employmentHistory.labels.lastJobRepeater,
              options(application) {
                const employmentList = getEmploymentFromRsk(
                  application.externalData,
                )
                return employmentList.map((job) => ({
                  value: job.employerSSN ?? '',
                  label:
                    job.employerSSN !== '-'
                      ? `${job.employer}, ${job.employerSSN}`
                      : job.employer,
                }))
              },
            },
            employer: {
              component: 'nationalIdWithName',
              required: true,
              condition: (_, activeField) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''

                return nationalIdChosen === '-'
              },
            },
            percentage: {
              component: 'input',
              label:
                employmentMessages.currentSituation.labels
                  .partTimeJobPercentage,
              width: 'half',
              type: 'number',
              suffix: '%',
              required: true,
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.currentSituation.labels.partTimeJobStartDate,
              width: 'half',
              required: true,
            },
            workHours: {
              component: 'input',
              label:
                employmentMessages.currentSituation.labels.partTimeJobWorkHours,
              width: 'half',
              required: true,
            },
            salary: {
              component: 'input',
              label:
                employmentMessages.currentSituation.labels.partTimeJobSalary,
              width: 'half',
              currency: true,
              required: true,
            },
          },
        }),
        buildAlertMessageField({
          id: 'currentSituation.occasionalJobAlert',
          message:
            employmentMessages.currentSituation.labels.occasionalJobInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: isOccasionallyEmployed,
        }),
        buildFieldsRepeaterField({
          id: 'currentSituation.currentSituationRepeater',
          minRows: 1,
          marginTop: 0,
          formTitle: (index) => {
            return {
              id: employmentMessages.currentSituation.labels
                .jobRepeaterEmployment.id,
              values: { index: index },
            }
          },
          formTitleVariant: 'h5',
          formTitleNumbering: 'none',
          width: 'full',
          condition: isOccasionallyEmployed,
          addItemButtonText: employmentMessages.employmentHistory.labels.addJob,
          fields: {
            nationalIdWithName: {
              component: 'select',
              label: 'TODO',
              options(application) {
                const employmentList = getEmploymentFromRsk(
                  application.externalData,
                )
                return employmentList.map((job) => ({
                  value: job.employerSSN ?? '',
                  label:
                    job.employerSSN !== '-'
                      ? `${job.employer}, ${job.employerSSN}`
                      : job.employer,
                }))
              },
            },
            employer: {
              component: 'nationalIdWithName',
              required: true,
              condition: (application, activeField) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''

                return nationalIdChosen === '-'
              },
            },
            estimatedSalary: {
              label:
                employmentMessages.currentSituation.labels.jobEstimatedSalary,
              component: 'input',
              currency: true,
            },
          },
        }),
      ],
    }),
  ],
})
