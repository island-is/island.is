import {
  Application,
  ChildrenCustodyInformationApi,
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import {
  EhicApplyForPhysicalCardApi,
  EhicCardResponseApi,
} from '../dataProviders'
import { Form, FormModes } from '@island.is/application/types'
import {
  buildCheckboxField,
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'

import { CardResponse, NationalRegistry } from '../lib/types'
import { europeanHealthInsuranceCardApplicationMessages as e } from '../lib/messages'
import { getFromRegistry, hasInsurance } from '../lib/helpers/applicantHelper'

/* eslint-disable-next-line */
export interface EuropeanHealthInsuranceCardProps {}

export const EuropeanHealthInsuranceCardForm: Form = buildForm({
  id: 'EuropeanHealthInsuranceCardForm',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'intro',
      title: e.introScreen.sectionLabel,

      children: [
        buildCustomField(
          {
            id: 'introScreen',
            title: e.introScreen.sectionTitle,
            component: 'IntroScreen',
          },
          {
            subTitle: e.introScreen.sectionDescription,
          },
        ),
      ],
    }),

    buildSection({
      id: 'data',
      title: e.data.sectionLabel,
      children: [
        buildExternalDataProvider({
          title: e.data.sectionTitle,
          checkboxLabel: e.data.dataCollectionCheckboxLabel,
          id: 'approveExternalData',
          description: '',
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: 'Þjóðskrá Íslands',
              subTitle:
                'Við þurfum að sækja þessi gögn úr þjóðskrá. Lögheimili, hjúskaparstaða, maki og afkvæmi.',
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: EhicCardResponseApi,
              title: 'Sjúkratryggingar',
              subTitle:
                'Upplýsingar um stöðu heimildar á evrópska sjúktryggingakortinu',
            }),
          ],
        }),
        buildMultiField({
          id: 'plastic',
          title: e.applicants.sectionTitle,
          description: e.applicants.sectionDescription,
          condition: (_, externalData) => hasInsurance(externalData),
          children: [
            buildCheckboxField({
              id: 'applyForPlastic',
              backgroundColor: 'white',
              title: '',
              options: (application: Application) => {
                console.log(application, ' here')
                const fromNationaRegistry = getFromRegistry(application)
                console.log(fromNationaRegistry, 'fromNationaRegistry')
                const applying: Array<{ value: any; label: string }> = []

                const cardResponse = application.externalData.cardResponse
                  .data as CardResponse[]

                console.log(cardResponse, 'CardResponse')

                cardResponse.forEach((x) => {
                  const name = fromNationaRegistry.find(
                    (y) => y.nrid === x.applicantNationalId,
                  )?.name!
                  // const value = x.applicantNationalId + ',' + name
                  //  TODO: if x.canApply
                  if (x.isInsured) {
                    applying.push({
                      value: [x.applicantNationalId, name],
                      label: name,
                    })
                  }
                })

                console.log(applying, 'Applying')

                // TODO: if apply is empty. Nobody is insured.

                return applying as Array<{ value: any; label: string }>
              },
            }),
          ],
        }),
        buildDescriptionField({
          condition: (_, externalData) => !hasInsurance(externalData),
          id: 'noInsurance',
          title: 'No Insurance',
          description: 'Not insured',
        }),

        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        // buildDescriptionField({
        //   id: 'unused',
        //   title: '',
        //   description: '',
        // }),
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
                console.log(application)
                const ans = application.answers.applyForPlastic as Array<any>
                console.log('answers')
                console.log(ans)
                for (const i in ans) {
                  console.log([ans[i][0], ans[i][1]])
                  applying.push({
                    value: [ans[i][0], ans[i][1]],
                    label: ans[i][1],
                  })
                }
                return applying as Array<{ value: any; label: string }>
              },
            }),
            buildSubmitField({
              id: 'submit-pdf',
              title: e.review.submitButtonLabel,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: e.temp.submitButtonLabel,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        buildDescriptionField({
          id: 'pdf-Unused',
          title: '',
          description: '',
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: e.review.sectionLabel,
      children: [],
    }),

    buildSection({
      id: 'completed',
      title: e.confirmation.sectionLabel,
      children: [],
    }),
  ],
})

export default EuropeanHealthInsuranceCardForm
