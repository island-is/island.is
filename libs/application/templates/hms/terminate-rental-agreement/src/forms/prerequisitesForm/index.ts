import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FormModes, UserProfileApi } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { NationalRegistryApi, rentalAgreementsApi } from '../../dataProviders'
import HmsLogo from '../../assets/HmsLogo'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  logo: HmsLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.prereqMessages.title,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.prereqMessages.title,
          subTitle: m.prereqMessages.subTitle,
          checkboxLabel: m.prereqMessages.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.prereqMessages.userProfileTitle,
              subTitle: m.prereqMessages.userProfileDescription,
            }),
            buildDataProviderItem({
              provider: NationalRegistryApi,
              title: m.prereqMessages.nationalRegistryTitle,
              subTitle: m.prereqMessages.nationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: rentalAgreementsApi,
              title: m.prereqMessages.housingBenefitsTitle,
              subTitle: m.prereqMessages.housingBenefitsDescription,
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
