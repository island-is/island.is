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
import { addDocuments, overview, thirdPartyComment } from '../lib/messages'

export const ThirdPartyComment: Form = buildForm({
  id: 'ParentalLeaveThirdPartyComment',
  title: addDocuments.general.sectionTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'comment.section',
      title: addDocuments.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'comment.multifield',
          title: thirdPartyComment.general.name,
          children: [
            buildCustomField({
              id: 'comment',
              title: '',
              component: 'ThirdPartyComment',
            }),
          ],
        }),
      ],
    }),
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
