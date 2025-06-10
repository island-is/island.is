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
import {
  UnemploymentApi,
  UserProfileApi,
  WorkMachineLicensesApi,
} from '../../dataProviders'
import Logo from '../../assets/Logo'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: 'Forkröfur',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'External data',
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: 'User profile',
              subTitle: 'User profile',
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: 'NationalRegistrySpouseApi',
              subTitle: 'NationalRegistrySpouseApi',
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: 'NationalRegistryUserApi',
              subTitle: 'NationalRegistryUserApi',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: 'ChildrenCustodyInformationApi',
              subTitle: 'ChildrenCustodyInformationApi',
            }),
            buildDataProviderItem({
              provider: WorkMachineLicensesApi,
              title: 'WorkMachineLicensesApi',
              subTitle: 'WorkMachineLicensesApi',
            }),
            buildDataProviderItem({
              provider: UnemploymentApi,
              title: 'UnemploymentApi',
              subTitle: 'UnemploymentApi',
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
