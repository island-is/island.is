import {
  buildAlertMessageField,
  buildDateField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import { employment as employmentMessages } from '../../../lib/messages'
import { FormValue } from '@island.is/application/types'

export const employmentHistorySubSection = buildSubSection({
  id: 'employmentHistorySubSection',
  title: employmentMessages.employmentHistory.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'employmentHistorySubSection',
      title: employmentMessages.employmentHistory.general.pageTitle,
      description: employmentMessages.employmentHistory.general.pageDescription,
      children: [
        buildRadioField({
          id: 'employmentHistory.isIndependent',
          title:
            employmentMessages.employmentHistory.labels.independentCheckbox,
          width: 'half',
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'employmentHistoryIndependentDescription',
          title: employmentMessages.employmentHistory.labels.lastJobLabel,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'employmentHistory.lastJob.companyNationalId',
          title:
            employmentMessages.employmentHistory.labels
              .lastJobCompanyNationalId,
          width: 'half',
        }),
        buildTextField({
          id: 'employmentHistory.lastJob.companyName',
          title: employmentMessages.employmentHistory.labels.lastJobCompanyName,
          width: 'half',
        }),
        buildTextField({
          // TODO this should be a select field
          id: 'employmentHistory.lastJob.title',
          title: employmentMessages.employmentHistory.labels.lastJobTitle,
          width: 'half',
        }),
        buildTextField({
          id: 'employmentHistory.lastJob.percentage',
          title: employmentMessages.employmentHistory.labels.lastJobPercentage,
          width: 'half',
        }),
        buildDateField({
          id: 'employmentHistory.lastJob.startDate',
          title: employmentMessages.employmentHistory.labels.lastJobStartDate,
          width: 'half',
        }),
        buildDateField({
          id: 'employmentHistory.lastJob.endDate',
          title: employmentMessages.employmentHistory.labels.lastJobEndDate,
          width: 'half',
        }),
        buildAlertMessageField({
          id: 'employmentHistoryAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.lastJobAlertInformation,
          alertType: 'warning',
        }),
        buildFieldsRepeaterField({
          id: 'employmentHistory.previousJobs',
          minRows: 0,
          width: 'full',
          formTitleNumbering: 'none',
          addItemButtonText: employmentMessages.employmentHistory.labels.addJob,
          fields: {
            company: {
              component: 'nationalIdWithName',
              required: true,
            },
            jobTitle: {
              component: 'input',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              type: 'text',
            },
            jobPercentage: {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels.lastJobPercentage,
              width: 'half',
              type: 'text',
            },
            jobStartDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastJobStartDate,
              width: 'half',
            },
            jobEndDate: {
              component: 'date',
              label: employmentMessages.employmentHistory.labels.lastJobEndDate,
              width: 'half',
            },
          },
        }),
        buildRadioField({
          id: 'employmentHistory.hasWorkedEes',
          title: employmentMessages.employmentHistory.labels.radioEesLabel,
          width: 'half',
          options: [
            {
              value: YES,
              label: coreMessages.radioYes,
            },
            {
              value: NO,
              label: coreMessages.radioNo,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'employmentHistoryEesAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.eesAlertInformation,
          alertType: 'info',
          condition: (answers: FormValue) => {
            const hasWorkedEes = getValueViaPath<string>(
              answers,
              'employmentHistory.hasWorkedEes',
              '',
            )

            return hasWorkedEes === YES
          },
        }),
      ],
    }),
  ],
})
