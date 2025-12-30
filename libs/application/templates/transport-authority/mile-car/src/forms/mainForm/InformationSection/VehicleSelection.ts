import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { selectVehicle as selectVehicleMessages } from '../../../lib/messages'
export const selectVehicleSection = buildSubSection({
  id: 'selectVehicleSection',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: selectVehicleMessages.general.pageTitle,
      description: selectVehicleMessages.general.description,
      children: [
        buildCustomField({
          id: 'vehiclesField',
          component: 'VehiclesField',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: selectVehicleMessages.labels.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: selectVehicleMessages.labels.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
