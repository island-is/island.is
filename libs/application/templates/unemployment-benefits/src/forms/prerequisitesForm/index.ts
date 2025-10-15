import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  FormModes,
  NationalRegistryUserApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'
import { LocaleApi, UnemploymentApi, UserProfileApi } from '../../dataProviders'
import Logo from '../../assets/Logo'
import { externalData } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: externalData.dataProvider.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.sectionTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: UnemploymentApi,
              title: externalData.vmst.rskTitle,
              subTitle: externalData.vmst.rskSubTitle,
            }),
            buildDataProviderItem({
              title: externalData.vmst.insuranceTitle,
              subTitle: externalData.vmst.insuranceSubTitle,
            }),
            buildDataProviderItem({
              provider: LocaleApi,
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
