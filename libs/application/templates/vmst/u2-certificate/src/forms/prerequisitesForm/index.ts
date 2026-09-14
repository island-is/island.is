import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  DefaultEvents,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'
import { FormModes } from '@island.is/application/types'
import { prerequisitesForm as m } from '../../lib/messages'
import { EESCountriesApi, EligibilityApi } from '../../dataProviders'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildSection({
      id: 'prerequisite',
      tabTitle: m.general.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.general.externalDataTitle,
          checkboxLabel: m.general.checkbox,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryV3UserApi,
              title: m.dataProviders.myPagesTitle,
              subTitle: m.dataProviders.myPagesSubtitle,
            }),
            buildDataProviderItem({
              title: m.dataProviders.nationalRegistryTitle,
              subTitle: m.dataProviders.nationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: EligibilityApi,
              title: m.dataProviders.vmstTitle,
              subTitle: m.dataProviders.vmstSubTitle,
            }),
            buildDataProviderItem({
              provider: EESCountriesApi,
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
