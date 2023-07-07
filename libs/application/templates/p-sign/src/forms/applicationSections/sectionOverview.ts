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
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { YES, NO, SEND_HOME, PICK_UP } from '../../lib/constants'
import { Photo, Delivery } from '../../types'

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
        buildKeyValueField({
          label: m.applicantsAddress,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).address
              ?.streetAddress,
        }),
        buildKeyValueField({
          label: m.applicantsCity,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).address
              ?.postalCode +
            ', ' +
            (nationalRegistry.data as NationalRegistryUser).address?.city,
        }),
        buildKeyValueField({
          label: m.applicantsEmail,
          width: 'half',
          value: ({ answers: { email } }) => email as string,
        }),
        buildKeyValueField({
          label: m.applicantsPhoneNumber,
          width: 'half',
          value: ({ answers: { phone } }) => phone as string,
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.cardValidityPeriod,
          width: 'half',
          value: ({ externalData: { doctorsNote } }) =>
            format(
              new Date((doctorsNote.data as any).expirationDate),
              'dd/MM/yyyy',
              { locale: is },
            ),
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.qualityPhotoTitle,
          width: 'half',
          value: '',
        }),
        buildCustomField({
          id: 'uploadedPhoto',
          title: '',
          component: 'UploadedPhoto',
          condition: (answers) =>
            (answers.photo as Photo)?.qualityPhoto === NO ||
            !(answers.photo as Photo)?.qualityPhoto,
        }),
        buildCustomField({
          id: 'qphoto',
          title: '',
          component: 'QualityPhoto',
          condition: (answers) =>
            (answers.photo as Photo)?.qualityPhoto === YES,
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: ({ answers }) => {
            return `Þú hefur valið að sækja stæðiskortið sjálf/ur/t hjá: ${
              (answers.delivery as Delivery)?.district
            }`
          },
          condition: (answers) =>
            (answers.delivery as Delivery)?.deliveryMethod === PICK_UP,
        }),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: () => m.overviewDeliveryText,
          condition: (answers) =>
            (answers.delivery as Delivery)?.deliveryMethod === SEND_HOME,
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
