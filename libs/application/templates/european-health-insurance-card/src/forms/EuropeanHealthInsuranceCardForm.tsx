import { Application, DefaultEvents } from '@island.is/application/types'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  getDefaultValuesForPDFApplicants,
  getEhicResponse,
  getFullName,
  hasAPDF,
  someAreNotInsured,
  someCanApplyForPlastic,
  someCanApplyForPlasticOrPdf,
  someHavePDF,
  someHavePlasticButNotPdf,
} from '../lib/helpers/applicantHelper'

import { CardResponse } from '../lib/types'
import { Sjukra } from '../assets'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'

export const EuropeanHealthInsuranceCardForm: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardForm',
  title: '',
  logo: Sjukra,
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
          id: 'plastic',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          condition: (_, externalData) =>
            someCanApplyForPlasticOrPdf(externalData),
          children: [
            buildCheckboxField({
              id: 'applyForPlastic',
              backgroundColor: 'white',
              title: '',
              condition: (_, externalData) =>
                someCanApplyForPlastic(externalData),
              options: (application: Application) => {
                const applying: Array<any> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.canApply) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel: e.applicants.sectionHasNoPlasticLabel,
                    })
                  }
                })
                return applying as Array<{ value: any; label: string }>
              },
            }),

            buildDescriptionField({
              id: 'break',
              title: '',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),

            buildCheckboxField({
              id: 'addForPDF',
              backgroundColor: 'white',
              title: e.temp.sectionCanTitle,
              description: '',
              condition: (_, externalData) =>
                someHavePlasticButNotPdf(externalData),
              options: (application: Application) => {
                const applying: Array<any> = []

                getEhicResponse(application).forEach((x) => {
                  if (x.isInsured && !x.canApply && !hasAPDF(x)) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel: e.temp.sectionHasPlasticLabel,
                    })
                  }
                })

                return applying as Array<{ value: any; label: string }>
              },
            }),

            buildDescriptionField({
              id: 'break',
              title: '',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),

            buildCheckboxField({
              id: 'havePdf',
              backgroundColor: 'white',
              title: 'Eiga pdf',
              description: '',
              condition: (_, externalData) => someHavePDF(externalData),
              options: (application: Application) => {
                const applying: Array<any> = []
                getEhicResponse(application).forEach((x) => {
                  if (x.isInsured && hasAPDF(x)) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel:
                        'm.noDeprivedDrivingLicenseInOtherCountryDescription.defaultMessage',
                      disabled: true,
                    })
                  }
                })
                return applying as Array<{ value: any; label: string }>
              },
            }),

            buildCheckboxField({
              id: 'notApplicable',
              backgroundColor: 'white',
              title: e.no.sectionTitle,
              description: e.no.sectionDescription,
              condition: (_, externalData) => someAreNotInsured(externalData),
              options: (application: Application) => {
                const applying: Array<any> = []
                getEhicResponse(application).forEach((x) => {
                  if (!x.isInsured && !x.canApply) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                      subLabel: e.no.sectionSubDescription,
                      disabled: true,
                    })
                  }
                })
                return applying as Array<{ value: any; label: string }>
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
            buildCheckboxField({
              id: 'applyForPDF',
              backgroundColor: 'white',
              title: '',

              options: (application: Application) => {
                const applying = []
                // Are applying for a new plastic card
                const ans = application.answers.applyForPlastic as Array<any>

                for (const i in ans) {
                  applying.push({
                    value: ans[i],
                    label: getFullName(application, ans[i]),
                  })
                }

                // Find those who have been issued plastic cards
                const cardResponse = application.externalData.cardResponse
                  .data as CardResponse[]

                cardResponse.forEach((x) => {
                  if (x.isInsured && !x.canApply) {
                    applying.push({
                      value: x.applicantNationalId,
                      label: getFullName(application, x.applicantNationalId),
                    })
                  }
                })

                return applying as Array<{ value: any; label: string }>
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
              title: '',
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
          title: '',
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
