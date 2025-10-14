import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildFileUploadField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  employment as employmentMessages,
  application as applicationMessages,
} from '../../../lib/messages'
import { GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO } from '@island.is/clients/vmst-unemployment'
import { getReasonBasedOnChoice, getReasonsBasedOnChoice } from '../../../utils'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../shared/constants'
import { Application } from '@island.is/application/types'

export const reasonForJobSearchSubSection = buildSubSection({
  id: 'reasonForJobSearchSubSection',
  title: employmentMessages.reasonForJobSearch.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'reasonForJobSearchSubSection',
      title: employmentMessages.reasonForJobSearch.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'reasonForJobSearch.description',
          title:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchDescription,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'reasonForJobSearch.mainReason',
          title:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchLabel,
          placeholder:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchPlaceholder,

          options: (application, _, locale) => {
            const unemploymentReasonCategories =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.unemploymentReasonCategories',
                [],
              ) || []

            return unemploymentReasonCategories.map((category) => {
              return {
                label:
                  locale === 'is'
                    ? category.name || ''
                    : category.english || '',
                value: category.id || '',
              }
            })
          },
        }),
        buildHiddenInputWithWatchedValue({
          id: 'reasonForJobSearch.additionalReasonRequired',
          watchValue: 'reasonForJobSearch.mainReason',
          valueModifier: (value, application: Application | undefined) => {
            if (!application) {
              return ''
            }
            const unemploymentReasonCategories =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.unemploymentReasonCategories',
                [],
              ) || []
            let required = false
            unemploymentReasonCategories.forEach((cat) => {
              if (cat.id === value) {
                required =
                  !!cat.unemploymentReasons &&
                  cat.unemploymentReasons.length > 0
              }
            })

            return required
          },
        }),
        buildSelectField({
          id: 'reasonForJobSearch.additionalReason',
          title:
            employmentMessages.reasonForJobSearch.labels
              .furtherExplanationLabel,
          placeholder:
            employmentMessages.reasonForJobSearch.labels
              .reasonForJobSearchPlaceholder,
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonsBasedOnChoice(
              answers,
              externalData,
            )
            return !!reasonBasedOnChoice && reasonBasedOnChoice.length > 0
          },
          options: (application, _, locale) => {
            const reasons = getReasonsBasedOnChoice(
              application.answers,
              application.externalData,
            )

            return (
              reasons?.map((reason) => {
                return {
                  label:
                    locale === 'is' ? reason.name || '' : reason.english || '',
                  value: reason.id || '',
                }
              }) || []
            )
          },
        }),
        buildDescriptionField({
          id: 'reasonForJobSearch.additionalReasonDescription',
          title:
            employmentMessages.reasonForJobSearch.labels
              .additionalReasonForJobSearchDescription,
          titleVariant: 'h5',
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return (
              !!reasonBasedOnChoice &&
              !!reasonBasedOnChoice.requiresAdditonalDetails
            )
          },
        }),
        buildHiddenInputWithWatchedValue({
          id: 'reasonForJobSearch.additionalReasonTextRequired',
          watchValue: 'reasonForJobSearch.additionalReason',
          valueModifier: (value, application: Application | undefined) => {
            if (!application) {
              return ''
            }
            const unemploymentReasonCategories =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.unemploymentReasonCategories',
                [],
              ) || []
            let required: boolean | undefined = false
            unemploymentReasonCategories.forEach((cat) => {
              cat.unemploymentReasons?.forEach((reason) => {
                if (reason.id === value) {
                  required = reason.requiresAdditonalDetails
                }
              })
            })

            return required
          },
        }),
        buildTextField({
          id: 'reasonForJobSearch.additionalReasonText',
          title:
            employmentMessages.reasonForJobSearch.labels
              .additionalReasonForJobSearchLabel,
          variant: 'textarea',
          rows: 6,
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return (
              !!reasonBasedOnChoice &&
              !!reasonBasedOnChoice.requiresAdditonalDetails
            )
          },
        }),

        buildHiddenInputWithWatchedValue({
          id: 'reasonForJobSearch.healthReasonRequired',
          watchValue: 'reasonForJobSearch.additionalReason',
          valueModifier: (value, application: Application | undefined) => {
            if (!application) {
              return ''
            }
            const unemploymentReasonCategories =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsUnemploymentReasonsUnemploymentReasonCatagoryDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.unemploymentReasonCategories',
                [],
              ) || []
            let required: boolean | undefined = false
            unemploymentReasonCategories.forEach((cat) => {
              cat.unemploymentReasons?.forEach((reason) => {
                if (reason.id === value) {
                  required = reason.healthReason
                }
              })
            })

            return required
          },
        }),
        buildFileUploadField({
          id: 'reasonForJobSearch.healthReason',
          uploadHeader:
            employmentMessages.reasonForJobSearch.labels.healthReasonFileLabel,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return !!reasonBasedOnChoice && !!reasonBasedOnChoice.healthReason
          },
        }),
        buildAlertMessageField({
          id: 'reasonForJobSearch.alertMessage',
          message: employmentMessages.reasonForJobSearch.labels.informationBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildCheckboxField({
          id: 'reasonForJobSearch.bankruptsyReason',
          options: [
            {
              value: YES,
              label:
                employmentMessages.reasonForJobSearch.labels
                  .bankruptsyReasonLabel,
            },
          ],
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return (
              !!reasonBasedOnChoice && !!reasonBasedOnChoice.bankruptcyReason
            )
          },
        }),
        buildCheckboxField({
          id: 'reasonForJobSearch.agreementConfirmation',
          options: [
            {
              value: YES,
              label:
                employmentMessages.reasonForJobSearch.labels
                  .agreementConfirmationLabel,
            },
          ],
        }),
      ],
    }),
  ],
})
