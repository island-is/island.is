import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { EligibleVehiclesApi } from '../../dataProviders'
import { m } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.prerequisites.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.prerequisites.title,
          checkboxLabel: m.prerequisites.checkbox,
          dataProviders: [
            buildDataProviderItem({
              provider: EligibleVehiclesApi,
              title: m.prerequisites.vehiclesTitle,
              subTitle: m.prerequisites.vehiclesSubTitle,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
