import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { HeilsugaeslaHofudborgarsvaedisinsLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: HeilsugaeslaHofudborgarsvaedisinsLogo,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.general.shorterApplicationTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.general.shorterApplicationTitle,
          dataProviders: [
            buildDataProviderItem({
              title: m.prerequisites.nationalRegistryTitle,
              subTitle: m.prerequisites.nationalRegistrySubTitle,
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
