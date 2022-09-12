import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser } from '../../types/schema'
import { m } from '../../lib/messages'

export const sectionOverview = buildSection({
  id: 'overview',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewTitle,
      space: 1,
      description: m.overviewSectionDescription,
      children: [
        buildDividerField({}),
        buildKeyValueField({
          label: m.applicantsName,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildKeyValueField({
          label: m.applicantsNationalId,
          width: 'half',
          value: (application: Application) =>
            formatNationalId(application.applicant),
        }),

        buildDividerField({}),

        buildDividerField({}),
        buildKeyValueField({
          label: m.qualityPhotoTitle,
          width: 'half',
          value: '',
        }),

        buildCustomField({
          id: 'qphoto',
          title: '',
          component: 'QualityPhoto',
        }),
        buildKeyValueField({
          label: m.qualityPhotoTitle,
          width: 'half',
          value: '',
        }),
        buildCustomField({
          id: 'qphoto',
          title: '',
          component: 'QualitySignature',
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: ({ answers: { district } }) => {
            return `Þú hefur valið að sækja stæðiskortið sjálf/ur/t hjá: ${district}`
          },
        }),

        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Senda inn umsókn',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
