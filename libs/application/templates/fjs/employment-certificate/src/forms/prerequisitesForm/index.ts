import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import {
  EmploymentEligibilityApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '../../dataProviders'
import { prerequisites as m, sections } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: FjarsyslaRikisinsLogo,
  children: [
    buildSection({
      id: 'conditions',
      title: sections.externalData,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.title,
          checkboxLabel: m.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryV3UserApi,
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.userProfileTitle,
              subTitle: m.userProfileSubTitle,
            }),
            buildDataProviderItem({
              provider: EmploymentEligibilityApi,
              title: m.employmentHistoryTitle,
              subTitle: m.employmentHistorySubTitle,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: m.submitButton,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
