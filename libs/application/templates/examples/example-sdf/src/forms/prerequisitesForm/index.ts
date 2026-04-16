import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { MyPlotsApi } from '../../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: 'Prerequisites',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Data collection',
          subTitle: 'The following data will be fetched electronically with your consent',
          description:
            'We need to retrieve your registered garden plots so you can select which one to enlarge.',
          checkboxLabel: 'I agree to the data collection',
          dataProviders: [
            buildDataProviderItem({
              provider: MyPlotsApi,
              title: 'My garden plots',
              subTitle:
                'Current plots registered to your national ID from the garden registry.',
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
