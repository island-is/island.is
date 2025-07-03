import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  FormModes,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'
import { UnemploymentApi, UserProfileApi } from '../../dataProviders'
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
              provider: NationalRegistrySpouseApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              // TODO: I'm guessing that the tax is suppose to be somewhere else?
              title: externalData.tax.title,
              subTitle: externalData.tax.subTitle,
            }),
            buildDataProviderItem({
              provider: UnemploymentApi,
              title: externalData.stateInsuranceAcency.title,
              subTitle: externalData.stateInsuranceAcency.subTitle,
            }),

            // buildDataProviderItem({
            //   provider: DrivingLicenseApi,
            //   title: 'DrivingLicenseApi',
            //   subTitle: 'DrivingLicenseApi',
            // }),
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
