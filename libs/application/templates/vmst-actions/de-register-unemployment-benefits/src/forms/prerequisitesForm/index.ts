import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FormModes } from '@island.is/application/types'
import { prerequisitesForm } from '../../lib/messages'
import { getSupportDataApi } from '../../dataProviders'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: prerequisitesForm.general.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: prerequisitesForm.general.externalDataTitle,
          dataProviders: [
            buildDataProviderItem({
              provider: getSupportDataApi,
              title: prerequisitesForm.dataProviders.vmstTitle,
              subTitle: prerequisitesForm.dataProviders.vmstSubTitle,
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
