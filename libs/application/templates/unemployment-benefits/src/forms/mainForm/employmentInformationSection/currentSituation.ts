import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'
import { EmploymentStatus } from '../../../shared'
import {
  hasEmployer,
  isEmployed,
  isEmployedAtAll,
  isEmployedPartTime,
  isOccasionallyEmployed,
} from '../../../utils'
import { Application } from '@island.is/application/types'
import { getRskOptions } from '../../../utils/getRskOptions'
import { getJobCodeOptions } from '../../../utils/getJobCodeOptions'

export const currentSituationSubSection = buildSubSection({
  id: 'currentSituationSubSection',
  title: employmentMessages.currentSituation.general.sectionTitle,
  children: [
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
          minRows: (answers) => {
            return isEmployedAtAll(answers) ? 1 : 0
          },
          maxRows: (answers) => {
            return isEmployed(answers) ? 1 : 10
          },
          marginTop: 0,
          formTitle: (index) => {
            return {
              ...employmentMessages.currentSituation.labels
                .jobRepeaterEmployment,
              values: { index: index + 1 },
            }
          },
          hideAddButton: (application) => {
            const employed = isEmployed(application.answers)
            return employed
          },
          formTitleVariant: 'h5',
          formTitleNumbering: 'none',
          width: 'full',
          condition: isEmployedAtAll,
          addItemButtonText: employmentMessages.employmentHistory.labels.addJob,
          fields: {
            nationalIdWithName: {
              component: 'select',
              required: true,
              label:
                employmentMessages.employmentHistory.labels.lastJobRepeater,
              options: (application, _, locale, formatMessage) =>
                getRskOptions(application, formatMessage),
            },
            employer: {
              component: 'nationalIdWithName',
              customNameLabel:
                employmentMessages.employmentHistory.labels
                  .customEmployerNameLabel,
              customNationalIdLabel:
                employmentMessages.employmentHistory.labels
                  .customEmployerNationalIdLabel,
              searchPersons: true,
              searchCompanies: true,
              required: true,
              condition: (_, activeField) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''

                return nationalIdChosen === '-'
              },
            },
            title: {
              component: 'select',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              required: true,
              options: (application, _activeField, locale) =>
                getJobCodeOptions(application, locale),
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
              max: 100,
              condition: (application) => hasEmployer(application.answers),
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.currentSituation.labels.partTimeJobStartDate,
              width: 'half',
              required: true,
              condition: (application) =>
                isEmployedPartTime(application.answers),
            },
            predictedEndDate: {
              component: 'date',
              label: employmentMessages.currentSituation.labels.jobEndDate,
              width: 'half',
              condition: (application) => isEmployed(application.answers),
              minDate: new Date(),

              maxDate: (application: Application, _) => {
                const maxDays =
                  getValueViaPath<string>(
                    application.externalData,
                    'unemploymentApplication.data.supportData.maxCanStartDate',
                  ) ?? '14'
                return new Date(
                  new Date().getTime() +
                    parseInt(maxDays) * 24 * 60 * 60 * 1000,
                )
              },
              required: true,
            },
            workHours: {
              component: 'input',
              label:
                employmentMessages.currentSituation.labels.partTimeJobWorkHours,
              width: 'half',
              required: true,
              condition: (application) =>
                isEmployedPartTime(application.answers),
            },
            salary: {
              component: 'input',
              label:
                employmentMessages.currentSituation.labels.partTimeJobSalary,
              width: 'half',
              currency: true,
              required: true,
              condition: (application) =>
                isEmployedPartTime(application.answers),
            },
            estimatedSalary: {
              label:
                employmentMessages.currentSituation.labels.jobEstimatedSalary,
              component: 'input',
              width: 'half',
              currency: true,
              condition: (application) =>
                isOccasionallyEmployed(application.answers),
            },
          },
        }),
        buildAlertMessageField({
          id: 'currentSituation.ocassionalEndDateAlert',
          alertType: 'warning',
          message:
            employmentMessages.currentSituation.labels
              .stillEmployedEndDateAlert,
          condition: isEmployed,
        }),
        buildCustomField({
          id: 'currentSituation.updateEmploymentHistory',
          component: 'UpdateEmploymentHistory',
        }),
      ],
    }),
  ],
})
