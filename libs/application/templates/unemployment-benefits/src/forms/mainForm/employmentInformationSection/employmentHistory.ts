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
  getEmployerNameFromSSN,
  getEmploymentFromRsk,
} from '../../../utils'
import { CurrentEmploymentInAnswers } from '../../../shared'
import { GaldurDomainModelsSettingsJobCodesJobCodeDTO } from '@island.is/clients/vmst-unemployment'

export const employmentHistorySubSection = buildSubSection({
  id: 'employmentHistorySubSection',
  title: employmentMessages.employmentHistory.general.sectionTitle,
  children: [
    //TODO þarf ekki að skila neinu starfi,
    // TODO þarf að skoða ef notandi valdi "ekki i neinu starfi" -> þá á bara að vera tómt og möguleiki að bæta við starfi
    // TODO required dálkar -> ef þú velur starf úr dropdown þá verða allir reitir required, annars er enginn required
    // TODO hvenær lýkur uppsagnafresti þínum vs lauk störfum label
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
          defaultValue: NO, // TODO check if this breaks any conditions
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
        buildFieldsRepeaterField({
          id: 'employmentHistory.lastJobs',
          minRows: (answers: FormValue) => {
            const currentSituation =
              getValueViaPath<CurrentEmploymentInAnswers>(
                answers,
                'currentSituation.currentJob',
                undefined,
              )
            const currentSituationRepeater =
              getValueViaPath<Array<CurrentEmploymentInAnswers>>(
                answers,
                'currentSituation.currentSituationRepeater',
                [],
              ) ?? []
            const minRows =
              (currentSituation ? 1 : 0) + currentSituationRepeater.length
            return minRows
          },
          marginTop: 0,
          formTitle:
            employmentMessages.employmentHistory.labels.lastJobRepeater,
          formTitleVariant: 'h5',
          hideAddItemButton: true,
          condition: (answers) => !isIndependent(answers),
          fields: {
            'employer.nationalId': {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels
                  .lastJobCompanyNationalId,
              width: 'half',
              type: 'text',
              readonly: (application) => {
                console.log('application', application)
                return true
              },
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const firstCurrentJob =
                  getValueViaPath<CurrentEmploymentInAnswers>(
                    application.answers,
                    'currentSituation.currentJob',
                    undefined,
                  )

                const repeaterJobs =
                  getValueViaPath<CurrentEmploymentInAnswers[]>(
                    application.answers,
                    'currentSituation.currentSituationRepeater',
                    [],
                  ) ?? []

                return index === 0
                  ? firstCurrentJob?.nationalIdWithName
                    ? firstCurrentJob?.nationalIdWithName
                    : firstCurrentJob?.employer?.nationalId
                  : repeaterJobs[index - 1].employer?.nationalId
              },
            },
            'employer.name': {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels.lastJobCompanyName,
              width: 'half',
              type: 'text',
              readonly: true,
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const firstCurrentJob =
                  getValueViaPath<CurrentEmploymentInAnswers>(
                    application.answers,
                    'currentSituation.currentJob',
                    undefined,
                  )
                const repeaterJobs =
                  getValueViaPath<CurrentEmploymentInAnswers[]>(
                    application.answers,
                    'currentSituation.currentSituationRepeater',
                    [],
                  ) ?? []

                const nationalId =
                  index === 0
                    ? firstCurrentJob?.nationalIdWithName
                      ? firstCurrentJob?.nationalIdWithName
                      : firstCurrentJob?.employer?.nationalId
                    : repeaterJobs[index - 1].employer?.nationalId

                const name =
                  index === 0 && firstCurrentJob?.employer?.name
                    ? firstCurrentJob?.employer?.name
                    : index > 0 && repeaterJobs[index - 1].employer?.name
                    ? repeaterJobs[index - 1].employer?.name
                    : getEmployerNameFromSSN(
                        application.externalData,
                        nationalId || '',
                      )

                return name
              },
            },
            title: {
              component: 'select',
              label: employmentMessages.employmentHistory.labels.lastJobTitle,
              width: 'half',
              options: (application, _, locale) => {
                const jobList =
                  getValueViaPath<
                    GaldurDomainModelsSettingsJobCodesJobCodeDTO[]
                  >(
                    application.externalData,
                    'unemploymentApplication.data.supportData.jobCodes',
                  ) ?? []
                return jobList.map((job) => ({
                  value: job.id ?? '',
                  label:
                    (locale === 'is' ? job.name : job.english ?? job.name) ||
                    '',
                }))
              },
            },
            percentage: {
              component: 'input',
              label:
                employmentMessages.employmentHistory.labels.lastJobPercentage,
              width: 'half',
              type: 'number',
              suffix: '%',
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const firstCurrentJob =
                  getValueViaPath<CurrentEmploymentInAnswers>(
                    application.answers,
                    'currentSituation.currentJob',
                    undefined,
                  )
                const repeaterJobs =
                  getValueViaPath<CurrentEmploymentInAnswers[]>(
                    application.answers,
                    'currentSituation.currentSituationRepeater',
                    [],
                  ) ?? []

                return index === 0
                  ? firstCurrentJob?.percentage
                  : repeaterJobs[index - 1].percentage
              },
            },
            startDate: {
              component: 'date',
              label:
                employmentMessages.employmentHistory.labels.lastJobStartDate,
              width: 'half',
              defaultValue: (
                application: Application,
                _activeField: Record<string, string>,
                index: number,
              ) => {
                const firstCurrentJob =
                  getValueViaPath<CurrentEmploymentInAnswers>(
                    application.answers,
                    'currentSituation.currentJob',
                    undefined,
                  )
                const repeaterJobs =
                  getValueViaPath<CurrentEmploymentInAnswers[]>(
                    application.answers,
                    'currentSituation.currentSituationRepeater',
                    [],
                  ) ?? []

                return index === 0
                  ? firstCurrentJob?.startDate
                  : repeaterJobs[index - 1].startDate
              },
            },
            endDate: {
              component: 'date',
              label: employmentMessages.employmentHistory.labels.lastJobEndDate,
              width: 'half',
            },
          },
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
              condition: (_, activeField) => {
                const nationalIdChosen = activeField?.nationalIdWithName
                  ? activeField?.nationalIdWithName
                  : ''

                return nationalIdChosen === '-'
              },
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
