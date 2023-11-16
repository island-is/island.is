import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
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
      id: 'vehiclesOverviewSection',
      title: carRecyclingMessages.cars.list,
      children: [
        buildCustomField(
          {
            id: 'vehicles',
            childInputIds: ['vehicles.selectedVehicles', 'vehicles.allVehicles'],
            title: carRecyclingMessages.cars.sectionTitle,
            component: 'VehiclesOverview',
          },
          {
            editable: true,
          },
        ),
      ],
    }),
    buildSection({
      id: 'confirmSection',
      title: carRecyclingMessages.review.confirmSectionTitle,
      children: [
        buildSubSection({
          id: 'confirmSubSection',
          title: '',
          children: [
            buildMultiField({
              id: 'reviews',
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
