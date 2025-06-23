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
import { Application, FormValue } from '@island.is/application/types'
import {
  isIndependent,
  workOnOwnSSN,
  hasEmployer,
  getCombinedPercentage,
} from '../../../utils'
import { GaldurDomainModelsApplicantsApplicantProfileDTOsJob } from '@island.is/clients/vmst-unemployment'

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
          marginBottom: 2,
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
        /* IS NOT INDEPENDENT */
        buildDescriptionField({
          id: 'employmentHistoryNotIndependentDescription',
          title: employmentMessages.employmentHistory.labels.lastJobLabel,
          titleVariant: 'h5',
          condition: (answers) => !isIndependent(answers),
        }),
        buildTextField({
          id: 'employmentHistory.lastJob.companyNationalId',
          title:
            employmentMessages.employmentHistory.labels
              .lastJobCompanyNationalId,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            //TODO get most recent job from the job list
            const jobList =
              getValueViaPath<
                Array<GaldurDomainModelsApplicantsApplicantProfileDTOsJob>
              >(
                application.externalData,
                'unemploymentApplication.data.jobCareer.jobs',
                [],
              ) ?? []
            const manualInputCompanyNationalId =
              getValueViaPath<string>(
                application.answers,
                'currentSituation.currentJob.employer.nationalId',
              ) ?? ''

            const companyNationalId = hasEmployer(application.answers)
              ? manualInputCompanyNationalId
              : jobList[0]?.workRatio

            return companyNationalId
          },

          condition: (answers) => !isIndependent(answers),
        }),
        buildTextField({
          id: 'employmentHistory.lastJob.companyName',
          title: employmentMessages.employmentHistory.labels.lastJobCompanyName,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            //TODO get most recent job from the job list
            const jobList =
              getValueViaPath<
                Array<GaldurDomainModelsApplicantsApplicantProfileDTOsJob>
              >(
                application.externalData,
                'unemploymentApplication.data.jobCareer.jobs',
                [],
              ) ?? []
            const manualInputEmployerName =
              getValueViaPath<string>(
                application.answers,
                'currentSituation.currentJob.employer.name',
              ) ?? ''

            const employerName = hasEmployer(application.answers)
              ? manualInputEmployerName
              : jobList[0]?.workRatio

            return employerName
          },

          condition: (answers) => !isIndependent(answers),
        }),
        buildTextField({
          // TODO: this should maybe be a select field
          id: 'employmentHistory.lastJob.title',
          title: employmentMessages.employmentHistory.labels.lastJobTitle,
          width: 'half',
          condition: (answers) => !isIndependent(answers),
        }),
        buildTextField({
          id: 'employmentHistory.lastJob.percentage',
          title: employmentMessages.employmentHistory.labels.lastJobPercentage,
          width: 'half',
          variant: 'number',
          suffix: '%',
          defaultValue: (application: Application) => {
            //TODO get most recent job from the job list
            const jobList =
              getValueViaPath<
                Array<GaldurDomainModelsApplicantsApplicantProfileDTOsJob>
              >(
                application.externalData,
                'unemploymentApplication.data.jobCareer.jobs',
                [],
              ) ?? []
            const manualInputPercentage =
              getValueViaPath<string>(
                application.answers,
                'currentSituation.currentJob.percentage',
              ) ?? ''

            const percentage = hasEmployer(application.answers)
              ? manualInputPercentage
              : jobList[0]?.workRatio

            return percentage
          },

          condition: (answers) => !isIndependent(answers),
        }),
        buildDateField({
          id: 'employmentHistory.lastJob.startDate',
          title: employmentMessages.employmentHistory.labels.lastJobStartDate,
          width: 'half',
          maxDate: new Date(),
          defaultValue: (application: Application) => {
            //TODO get most recent job from the job list
            const jobList =
              getValueViaPath<
                Array<GaldurDomainModelsApplicantsApplicantProfileDTOsJob>
              >(
                application.externalData,
                'unemploymentApplication.data.jobCareer.jobs',
                [],
              ) ?? []
            const manualInputStartDate =
              getValueViaPath<string>(
                application.answers,
                'currentSituation.currentJob.startDate',
              ) ?? ''
            const startDate = hasEmployer(application.answers)
              ? manualInputStartDate
              : jobList[0]?.started
            // console.log('startDate', startDate && new Date(startDate))
            // return startDate ? new Date(startDate) : ''
            return ''
          },
          condition: (answers) => !isIndependent(answers),
        }),
        buildDateField({
          id: 'employmentHistory.lastJob.endDate',
          title: employmentMessages.employmentHistory.labels.lastJobEndDate,
          width: 'half',
          minDate: new Date(),
          condition: (answers) => !isIndependent(answers),
        }),
        /* IS INDEPENDENT */
        buildAlertMessageField({
          id: 'employmentHistoryIndependentAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.workOnOwnSSNAlert,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (answers) => isIndependent(answers),
        }),
        buildDescriptionField({
          id: 'employmentHistoryPreviousJobsDescription',
          title: employmentMessages.employmentHistory.labels.howLongOnOwnSSN,
          titleVariant: 'h5',
          condition: (answers) => isIndependent(answers),
        }),
        // TODO: Get from service
        buildTextField({
          id: 'employmentHistory.ownSSNJob.title',
          title: employmentMessages.employmentHistory.labels.lastJobTitle,
          width: 'half',
          condition: (answers) => isIndependent(answers),
        }),
        buildTextField({
          id: 'employmentHistory.ownSSNJob.percentage',
          title: employmentMessages.employmentHistory.labels.lastJobPercentage,
          width: 'half',
          variant: 'number',
          suffix: '%',
          condition: (answers) => isIndependent(answers),
        }),
        buildDateField({
          id: 'employmentHistory.ownSSNJob.startDate',
          title: employmentMessages.employmentHistory.labels.lastJobStartDate,
          width: 'half',
          maxDate: new Date(),
          condition: (answers) =>
            isIndependent(answers) && workOnOwnSSN(answers),
        }),
        buildDateField({
          id: 'employmentHistory.ownSSNJob.endDate',
          title: employmentMessages.employmentHistory.labels.lastOldJobEndDate,
          width: 'half',
          condition: (answers) => isIndependent(answers),
        }),
        buildAlertMessageField({
          id: 'employmentHistoryAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.lastJobAlertInformation,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => getCombinedPercentage(answers) < 100,
        }),
        buildAlertMessageField({
          id: 'employmentHistoryJobPercentageMessage',
          message:
            employmentMessages.employmentHistory.labels
              .lastJobPercentageAchievedInformation,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (answers) => getCombinedPercentage(answers) >= 100,
        }),
        /* OLD JOBS */

        buildFieldsRepeaterField({
          id: 'employmentHistory.previousJobs',
          minRows: 0,
          marginTop: 0,
          formTitle: employmentMessages.employmentHistory.labels.lastJobs,
          formTitleVariant: 'h5',
          width: 'full',
          addItemButtonText: employmentMessages.employmentHistory.labels.addJob,
          fields: {
            company: {
              component: 'nationalIdWithName',
              required: true,
            },
            title: {
              component: 'input',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              type: 'text',
            },
            percentage: {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels.lastJobPercentage,
              width: 'half',
              type: 'number',
              suffix: '%',
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastJobStartDate,
              width: 'half',
            },
            endDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastOldJobEndDate,
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
          condition: (answers) => getCombinedPercentage(answers) < 100,
        }),
        buildAlertMessageField({
          id: 'employmentHistoryEesAlertMessage',
          message:
            employmentMessages.employmentHistory.labels.eesAlertInformation,
          alertType: 'info',
          doesNotRequireAnswer: true,
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
