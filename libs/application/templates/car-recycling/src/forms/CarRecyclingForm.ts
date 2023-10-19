import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { carRecyclingMessages } from '../lib/messages'

export const CarRecyclingForm: Form = buildForm({
  id: 'carsOverview',
  title: carRecyclingMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: carRecyclingMessages.pre.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'vehiclesList',
      title: carRecyclingMessages.vehicles.list,
      children: [
        buildAlertMessageField({
          id: 'paymentInfo.alert',
          title: 'Afskrá',
          message: 'Afskrá listi',
          doesNotRequireAnswer: true,
          alertType: 'info',
        }),
      ],
    }),
    buildSection({
      id: 'confirm',
      title: carRecyclingMessages.review.confirmSectionTitle,
      children: [
        buildSubSection({
          title: '',
          children: [
            buildMultiField({
              id: 'confirm',
              title: '',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmScreen',
                    title: carRecyclingMessages.review.confirmSectionTitle,
                    component: 'Review',
                  },
                  {
                    editable: true,
                  },
                ),
                buildSubmitField({
                  id: 'submit',
                  placement: 'footer',
                  title: carRecyclingMessages.review.confirmSectionTitle,
                  actions: [
                    {
                      event: DefaultEvents.SUBMIT,
                      name: carRecyclingMessages.review.confirmSectionTitle,
                      type: 'primary',
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: 'oldAgePensionFormMessage.conclusionScreen.title',
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
