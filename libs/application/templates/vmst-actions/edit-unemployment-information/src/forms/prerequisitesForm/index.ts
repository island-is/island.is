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
import { UnemploymentApi } from '../../dataProviders'
import { application as applicationMessages } from '../../lib/messages'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: applicationMessages.externalDataPageTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: applicationMessages.externalDataPageTitle,
          checkboxLabel: applicationMessages.externalDataCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: UnemploymentApi,
              title: applicationMessages.dataProviderVmstTitle,
              subTitle: applicationMessages.dataProviderVmstDescription,
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
