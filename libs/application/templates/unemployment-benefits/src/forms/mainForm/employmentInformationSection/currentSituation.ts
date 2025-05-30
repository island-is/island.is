import {
  buildAlertMessageField,
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'
import { EmploymentStatus } from '../../../shared'
import {
  hasEmployer,
  isEmployed,
  isEmployedAtAll,
  isEmployedPartTime,
  isOccasionallyEmployed,
  isUnemployed,
} from '../../../utils'

export const currentSituationSubSection = buildSubSection({
  id: 'currentSituationSubSection',
  title: employmentMessages.currentSituation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'currentSituationSubSection',
      title: employmentMessages.currentSituation.general.pageTitle,
      children: [
        buildSelectField({
          id: 'currentSituation.status',
          title:
            employmentMessages.currentSituation.labels
              .currentSituationDropdownDescription,
          backgroundColor: 'blue',
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
          id: 'currentSituationDescription',
          title:
            employmentMessages.currentSituation.labels
              .reasonForUnemploymentDescription,
          titleVariant: 'h5',
          marginTop: 2,
          condition: isUnemployed,
        }),
        buildTextField({
          id: 'currentSituation.reasonForUnemployment',
          title:
            employmentMessages.currentSituation.labels
              .reasonForUnemploymentLabel,
          variant: 'textarea',
          rows: 6,
          condition: isUnemployed,
        }),

        buildDescriptionField({
          id: 'currentjobDescription',
          title:
            employmentMessages.currentSituation.labels.partTimeJobDescription,
          titleVariant: 'h5',
          marginTop: 2,
          condition: hasEmployer,
        }),
        buildNationalIdWithNameField({
          id: 'currentSituation.currentJob.employer',
          required: true,
          customNationalIdLabel:
            employmentMessages.currentSituation.labels
              .partTimeJobEmployerNationalId,
          customNameLabel:
            employmentMessages.currentSituation.labels.partTimeJobEmployerName,
          searchPersons: false,
          searchCompanies: true,
          condition: hasEmployer,
        }),
        buildTextField({
          id: 'currentSituation.currentJob.percentage',
          title:
            employmentMessages.currentSituation.labels.partTimeJobPercentage,
          width: 'half',
          variant: 'number',
          suffix: '%',
          condition: hasEmployer,
        }),
        buildDateField({
          id: 'currentSituation.currentJob.startDate',
          width: 'half',
          title:
            employmentMessages.currentSituation.labels.partTimeJobStartDate,
          condition: isEmployedPartTime,
        }),
        buildTextField({
          id: 'currentSituation.currentJob.workHours',
          width: 'half',
          title:
            employmentMessages.currentSituation.labels.partTimeJobWorkHours,
          condition: isEmployedPartTime,
        }),
        buildTextField({
          id: 'currentSituation.currentJob.salary',
          width: 'half',
          variant: 'currency',
          title: employmentMessages.currentSituation.labels.partTimeJobSalary,
          condition: isEmployedPartTime,
        }),
        buildDateField({
          id: 'currentSituation.currentJob.endDate',
          width: 'half',
          title: employmentMessages.currentSituation.labels.jobEndDate,
          condition: isEmployed,
        }),
        buildAlertMessageField({
          id: 'currentSituation.occasionalJobAlert',
          message:
            employmentMessages.currentSituation.labels.occasionalJobInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: isOccasionallyEmployed,
        }),
        buildDescriptionField({
          id: 'currentSituation.wantedJobDescription',
          title:
            employmentMessages.currentSituation.labels.wantedJobDescription,
          titleVariant: 'h5',
          marginTop: 2,
          condition: isEmployedAtAll,
        }),
        buildTextField({
          id: 'currentSituation.wantedJobPercentage',
          title:
            employmentMessages.currentSituation.labels.partTimeJobPercentage,
          variant: 'number',
          suffix: '%',
          condition: isEmployedAtAll,
        }),
        buildAlertMessageField({
          id: 'currentSituation.wantedJobAlert',
          message: employmentMessages.currentSituation.labels.wantedJobInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (answers) =>
            isEmployedPartTime(answers) || isOccasionallyEmployed(answers),
        }),
        buildAlertMessageField({
          id: 'currentSituation.wantedJobSecondAlert',
          message:
            employmentMessages.currentSituation.labels.wantedJobSecondInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: isEmployed,
        }),
        buildDescriptionField({
          id: 'currentSituation.jobTimelineDescription',
          title:
            employmentMessages.currentSituation.labels.jobTimelineDescription,
          titleVariant: 'h5',
          marginTop: 2,
          condition: isEmployedAtAll,
        }),
        buildDateField({
          id: 'currentSituation.jobTimelineStartDate',
          title:
            employmentMessages.currentSituation.labels.jobTimelineDateLabel,
          condition: isEmployedAtAll,
        }),
        buildAlertMessageField({
          id: 'currentSituation.jobTimelineAlert',
          message:
            employmentMessages.currentSituation.labels.jobTimelineInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: isEmployedAtAll,
        }),
      ],
    }),
  ],
})
