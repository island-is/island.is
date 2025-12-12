import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildFileUploadField,
  buildHiddenInputWithWatchedValue,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  coreMessages,
  getValueViaPath,
  NO,
  YES,
} from '@island.is/application/core'
import {
  employment as employmentMessages,
  application as applicationMessages,
  contentfulIdMapReasonsForJobSearch,
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
        buildRadioField({
          id: 'reasonForJobSearch.reasonQuestion',
          width: 'half',
          title: (application, _, formatMessage) => {
            let title = ''
            if (typeof formatMessage === 'function') {
              const reasonBasedOnChoice = getReasonBasedOnChoice(
                application.answers,
                application.externalData,
              )
              if (reasonBasedOnChoice?.contentfulQuestionId) {
                const contentfulId =
                  contentfulIdMapReasonsForJobSearch[
                    `${reasonBasedOnChoice?.contentfulQuestionId}#markdown`
                  ]
                title = formatMessage(contentfulId)
              }
            }
            return title
          },
          options: [
            { label: coreMessages.radioYes, value: YES },
            { label: coreMessages.radioNo, value: NO },
          ],
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return (
              !!reasonBasedOnChoice &&
              !!reasonBasedOnChoice.contentfulQuestionId
            )
          },
        }),
        buildHiddenInputWithWatchedValue({
          id: 'reasonForJobSearch.reasonQuestionRequired',
          watchValue: 'reasonForJobSearch.additionalReason',
          valueModifier: (value, application: Application | undefined) => {
            if (!application) {
              return ''
            }
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              application.answers,
              application.externalData,
            )
            return (
              !!reasonBasedOnChoice &&
              !!reasonBasedOnChoice.contentfulQuestionId
            )
          },
        }),
        buildDescriptionField({
          id: 'reasonForJobSearch.extraExplanation',
          description: (application, locale, formatMessage) => {
            let title = ''
            if (typeof formatMessage === 'function') {
              const reasonBasedOnChoice = getReasonBasedOnChoice(
                application.answers,
                application.externalData,
              )
              const radioAnswer = getValueViaPath<string>(
                application.answers,
                'reasonForJobSearch.reasonQuestion',
              )
              if (
                radioAnswer === YES &&
                reasonBasedOnChoice?.contentfulIdOnYes
              ) {
                const contentfulId =
                  contentfulIdMapReasonsForJobSearch[
                    `${reasonBasedOnChoice?.contentfulIdOnYes}#markdown`
                  ]
                title = formatMessage(contentfulId)
              }

              if (radioAnswer === NO && reasonBasedOnChoice?.contentfulIdOnNo) {
                const contentfulId =
                  contentfulIdMapReasonsForJobSearch[
                    `${reasonBasedOnChoice?.contentfulIdOnNo}#markdown`
                  ]
                title = formatMessage(contentfulId)
              }
            }
            return title
          },
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )

            const radioAnswer = getValueViaPath<string>(
              answers,
              'reasonForJobSearch.reasonQuestion',
            )
            return (
              !!reasonBasedOnChoice &&
              !!reasonBasedOnChoice.contentfulQuestionId &&
              !!radioAnswer
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
        buildDescriptionField({
          id: 'reasonForJobSearch.healthReasonDescription',
          title:
            employmentMessages.reasonForJobSearch.labels
              .healthReasonDescription,
          titleVariant: 'h5',
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return !!reasonBasedOnChoice && !!reasonBasedOnChoice.healthReason
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
        buildHiddenInputWithWatchedValue({
          id: 'reasonForJobSearch.attachmentTypeId',
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
            let attachmentTypeId: string | undefined = undefined
            unemploymentReasonCategories.forEach((cat) => {
              cat.unemploymentReasons?.forEach((reason) => {
                if (reason.id === value && reason.attachmentTypeId) {
                  attachmentTypeId = reason.attachmentTypeId
                } else if (
                  reason.id === value &&
                  reason.attachmentTypeIdOnYes
                ) {
                  attachmentTypeId = reason.attachmentTypeIdOnYes
                }
              })
            })

            return attachmentTypeId
          },
        }),
        buildDescriptionField({
          id: 'reasonForJobSearch.extraDescription',
          description(application, locale, formatMessage) {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              application.answers,
              application.externalData,
            )
            if (
              reasonBasedOnChoice?.contentfulId &&
              formatMessage &&
              typeof formatMessage === 'function'
            ) {
              const contentfulId =
                contentfulIdMapReasonsForJobSearch[
                  `${reasonBasedOnChoice?.contentfulId}#markdown`
                ]
              return formatMessage(contentfulId)
            }

            return ''
          },
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            return !!reasonBasedOnChoice && !!reasonBasedOnChoice.contentfulId
          },
        }),
        buildFileUploadField({
          id: 'reasonForJobSearch.extraFileUpload',
          uploadHeader: applicationMessages.fileUploadGeneralHeader,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          condition: (answers, externalData) => {
            const reasonBasedOnChoice = getReasonBasedOnChoice(
              answers,
              externalData,
            )
            const radioAnswer = getValueViaPath<string>(
              answers,
              'reasonForJobSearch.reasonQuestion',
            )
            return (
              !!reasonBasedOnChoice &&
              (!!reasonBasedOnChoice.attachmentTypeId ||
                (radioAnswer === YES &&
                  !!reasonBasedOnChoice.attachmentTypeIdOnYes))
            )
          },
        }),

        buildAlertMessageField({
          id: 'reasonForJobSearch.alertMessage',
          message: employmentMessages.reasonForJobSearch.labels.informationBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
        }),
        buildHiddenInputWithWatchedValue({
          id: 'reasonForJobSearch.bankruptsyReasonRequired',
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
                  required = reason.bankruptcyReason
                }
              })
            })

            return required
          },
        }),
        buildCheckboxField({
          id: 'reasonForJobSearch.bankruptsyReason',
          required: true,
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
          required: true,
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
