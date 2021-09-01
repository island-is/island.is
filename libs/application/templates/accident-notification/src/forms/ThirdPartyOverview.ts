import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  DefaultEvents,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { overview, thirdPartyComment } from '../lib/messages'

export const ThirdPartyOverview: Form = buildForm({
  id: 'AccidentNotificationThirdPartyOverview',
  title: 'Yfirlit',
  logo: Logo,
  children: [
    buildSection({
      id: 'overview.section',
      title: overview.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'overview.multifield',
          title: overview.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'overview',
              title: overview.general.sectionTitle,
              component: 'ThirdPartyFormOverview',
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: thirdPartyComment.buttons.reject,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: thirdPartyComment.buttons.approve,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // This is so that the submit field appears
        buildDescriptionField({
          id: 'temp',
          title: 'temp',
          description: 'temp',
        }),
      ],
    }),
  ],
})
