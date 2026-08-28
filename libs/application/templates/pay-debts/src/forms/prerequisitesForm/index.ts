import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FormModes, UserProfileApi } from '@island.is/application/types'
import { GetDebtsApi, MockPaymentCatalog } from '../../dataProviders'
import { externalData } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: GetDebtsApi,
              title: externalData.finances.title,
              subTitle: externalData.finances.subTitle,
            }),
            buildDataProviderItem({
              provider: MockPaymentCatalog,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
