import { Application, DefaultEvents } from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  formatText,
} from '@island.is/application/core'
import {
  getDefaultValuesForPDFApplicants,
  getEhicResponse,
  getFullName,
  getPlasticExpiryDate,
  hasAPDF,
  hasPlastic,
  someAreInsuredButCannotApply,
  someAreNotInsured,
  someCanApplyForPlastic,
  someCanApplyForPlasticOrPdf,
  someHavePDF,
  someHavePlasticButNotPdf,
} from '../lib/helpers/applicantHelper'

import { CardResponse, Answer } from '../lib/types'
import { Option } from '@island.is/application/types'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import { useLocale } from '@island.is/localization'

export const EuropeanHealthInsuranceCardForm: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardForm',
  logo: IcelandHealthLogo,
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [],
    }),
    buildSection({
      id: 'plastic',
      title: e.applicants.sectionLabel,
      children: [
        buildMultiField({
          id: 'delimitations',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          condition: (_, externalData) =>
            someCanApplyForPlasticOrPdf(externalData),
          children: [
            // Applying for a new Plastic card
            buildCheckboxField({
              id: 'delimitations.applyForPlastic',
              backgroundColor: 'white',
              condition: (_, externalData) =>
                someCanApplyForPlastic(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.canApply) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                    })
                  }
                })
                return applying
              },
            }),

            buildDescriptionField({
              id: 'break1',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
              condition: (_, externalData) =>
                someHavePlasticButNotPdf(externalData),
            }),

            // Have plastic card but can apply for PDF - Adds to the PDF array in next step
            buildCheckboxField({
              id: 'delimitations.addForPDF',
              backgroundColor: 'white',
              title: e.temp.sectionCanTitle,
              description: '',
              condition: (_, externalData) =>
                someHavePlasticButNotPdf(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []

                getEhicResponse(application).forEach((x) => {
                  if (x.canApplyForPDF) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                      subLabel: getPlasticExpiryDate(x)
                        ? formatText(
                            e.temp.sectionPlasticExpiryDate,
                            application,
                            useLocale().formatMessage,
                          ) +
                          ' ' +
                          getPlasticExpiryDate(x)?.toLocaleDateString('is-IS')
                        : '',
                    })
                  }
                })

                return applying
              },
            }),

            buildDescriptionField({
              id: 'break2',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
              condition: (_, externalData) => someHavePDF(externalData),
            }),

            // Have PDF and Plastic, show disabled checkboxes
            buildCheckboxField({
              id: 'havePdf',
              backgroundColor: 'white',
              title: e.temp.sectionHasPDFLabel,
              description: '',
              condition: (_, externalData) => someHavePDF(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.isInsured && hasAPDF(x)) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                      disabled: true,
                      subLabel: getPlasticExpiryDate(x)
                        ? formatText(
                            e.temp.sectionPlasticExpiryDate,
                            application,
                            useLocale().formatMessage,
                          ) +
                          ' ' +
                          getPlasticExpiryDate(x)?.toLocaleDateString('is-IS')
                        : '',
                    })
                  }
                })
                return applying
              },
            }),

            buildDescriptionField({
              id: 'break3',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
              condition: (_, externalData) => someAreNotInsured(externalData),
            }),

            // Are unable to apply for plastic or pdf. Uninsured or someother reason
            buildCheckboxField({
              id: 'notApplicable',
              backgroundColor: 'white',
              title: e.no.sectionTitle,
              description: e.no.sectionDescription,
              condition: (_, externalData) =>
                someAreNotInsured(externalData) ||
                someAreInsuredButCannotApply(externalData),
              options: (application: Application) => {
                const applying: Array<Option> = []
                getEhicResponse(application).forEach((x) => {
                  if (
                    !x.canApply &&
                    !x.canApplyForPDF &&
                    !hasAPDF(x) &&
                    !hasPlastic(x)
                  ) {
                    applying.push({
                      value: x.applicantNationalId ?? '',
                      label:
                        getFullName(application, x.applicantNationalId) ?? '',
                      disabled: true,
                    })
                  }
                })
                return applying
              },
            }),
          ],
        }),
        buildDescriptionField({
          condition: (_, externalData) =>
            !someCanApplyForPlasticOrPdf(externalData),
          id: 'noInsurance',
          title: e.no.sectionLabel,
          description: e.no.sectionDescription,
        }),
      ],
    }),

    buildSection({
      id: 'temp',
      title: e.temp.sectionLabel,
      children: [
        buildMultiField({
          id: 'tempApplicants',
          title: e.temp.sectionTitle,
          description: e.temp.sectionDescription,
          children: [
            // Applying for PDF
            buildCheckboxField({
              id: 'applyForPDF',
              backgroundColor: 'white',
              options: (application: Application) => {
                const applying: {
                  value: string
                  label: string
                  subLabel: string
                }[] = []
                // Are applying for a new plastic card
                const answers = application.answers as unknown as Answer
                const ans = answers.delimitations.applyForPlastic
                for (const i in ans) {
                  applying.push({
                    value: ans[i],
                    label: getFullName(application, ans[i]) ?? '',
                    subLabel: '',
                  })
                }

                // Find those who have been issued plastic cards
                const cardResponse = application.externalData.cardResponse
                  .data as CardResponse[]

                cardResponse.forEach((x) => {
                  if (x.canApplyForPDF) {
                    // If applying for new card then exlude the old card from the 'applying' array
                    if (
                      !applying.some((y) => y.value === x.applicantNationalId)
                    ) {
                      applying.push({
                        value: x.applicantNationalId ?? '',
                        label:
                          getFullName(application, x.applicantNationalId) ?? '',
                        subLabel: getPlasticExpiryDate(x)
                          ? formatText(
                              e.temp.sectionPlasticExpiryDate,
                              application,
                              useLocale().formatMessage,
                            ) +
                            ' ' +
                            getPlasticExpiryDate(x)?.toLocaleDateString('is-IS')
                          : '',
                      })
                    }
                  }
                })

                return applying
              },
              defaultValue: (application: Application) =>
                getDefaultValuesForPDFApplicants(application),
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicationReviewSection.applicationReview',
          title: e.review.sectionReviewTitle,
          description: e.review.sectionReviewDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: e.review.submitButtonLabel,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused4',
          description: '',
        }),
      ],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardForm
