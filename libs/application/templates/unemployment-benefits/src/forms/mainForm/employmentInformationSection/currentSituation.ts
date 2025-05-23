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
          condition: isEmployedPartTime,
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
          condition: hasEmployer,
        }),
        buildTextField({
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
          title: employmentMessages.currentSituation.labels.partTimeJobSalary,
          condition: isEmployedPartTime,
        }),
        buildTextField({
          id: 'currentSituation.currentJob.endDate',
          width: 'half',
          title: employmentMessages.currentSituation.labels.jobEndDate,
          condition: isEmployed,
        }),
        buildDescriptionField({
          id: 'currentSituation.wantedJobDescription',
          title:
            employmentMessages.currentSituation.labels.wantedJobDescription,
          titleVariant: 'h5',
          condition: isEmployedAtAll,
        }),
        buildTextField({
          id: 'currentSituation.wantedJobPercentage',
          title:
            employmentMessages.currentSituation.labels.partTimeJobPercentage,
          condition: isEmployedAtAll,
        }),
        buildAlertMessageField({
          id: 'currentSituation.wantedJobAlert',
          message: employmentMessages.currentSituation.labels.wantedJobInfoBox,
          alertType: 'info',
          condition: isEmployedAtAll,
        }),
        buildDescriptionField({
          id: 'currentSituation.jobTimelineDescription',
          title:
            employmentMessages.currentSituation.labels.jobTimelineDescription,
          titleVariant: 'h5',
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
          condition: isEmployedAtAll,
        }),
      ],
    }),
  ],
})
