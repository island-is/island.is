import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { TheIcelandicRecyclingFundLogo } from '@island.is/application/assets/institution-logos'
import { carRecyclingMessages } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const CarRecyclingForm: Form = buildForm({
  id: 'carsOverview',
  title: carRecyclingMessages.shared.formTitle,
  logo: TheIcelandicRecyclingFundLogo,
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
            childInputIds: [
              'vehicles.selectedVehicles',
              'vehicles.canceledVehicles',
              'permnoSearch',
            ],
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
      id: 'confirmation',
      title: carRecyclingMessages.review.confirmSectionTitle,
      children: [
        buildSubSection({
          id: '',
          children: [
            buildMultiField({
              id: 'confirmation',
              description: '',
              children: [
                buildCustomField(
                  {
                    id: 'confirmationScreen',
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
      ],
    }),
    buildFormConclusionSection({
      alertTitle: carRecyclingMessages.conclusionScreen.alertTitle,
      expandableHeader: carRecyclingMessages.conclusionScreen.nextStepsLabel,
      expandableDescription:
        carRecyclingMessages.conclusionScreen.accordionText,
    }),
  ],
})
