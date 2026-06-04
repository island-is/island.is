import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { application as applicationMessages } from '../../lib/messages'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import {
  CanReportWorkApi,
  PensionFundsApi,
  IncomeTypesApi,
} from '../../dataProviders'

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
              provider: CanReportWorkApi,
              title: applicationMessages.dataProviderVmstTitle,
              subTitle: applicationMessages.dataProviderVmstDescription,
            }),
            buildDataProviderItem({
              provider: PensionFundsApi,
            }),
            buildDataProviderItem({
              provider: IncomeTypesApi,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: applicationMessages.externalDataSubmitButton,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
