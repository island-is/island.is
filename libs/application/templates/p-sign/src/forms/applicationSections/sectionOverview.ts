import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
  YES,
  NO,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'
import { SEND_HOME, PICK_UP } from '../../lib/constants'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'
import { NationalRegistryAddress } from '@island.is/api/schema'

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
          value: ({ externalData }) => {
            const fullName =
              getValueViaPath<string>(
                externalData,
                'nationalRegistry.data.fullName',
              ) ?? ''
            return fullName
          },
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
          value: ({ externalData }) => {
            const streetAddress = getValueViaPath<string>(
              externalData,
              'nationalRegistry.data.address.streetAddress',
            )
            return streetAddress
          },
        }),
        buildKeyValueField({
          label: m.applicantsCity,
          width: 'half',
          value: ({ externalData }) => {
            const address = getValueViaPath<NationalRegistryAddress>(
              externalData,
              'nationalRegistry.data.address',
            )
            return `${address?.postalCode}, ${address?.city}`
          },
        }),
        buildKeyValueField({
          label: m.applicantsEmail,
          width: 'half',
          value: ({ answers }) => {
            const email = getValueViaPath<string>(answers, 'email') ?? ''
            return email
          },
        }),
        buildKeyValueField({
          label: m.applicantsPhoneNumber,
          width: 'half',
          value: ({ answers }) => {
            const phone = getValueViaPath<string>(answers, 'phone') ?? ''
            return formatPhoneNumber(removeCountryCode(phone))
          },
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.cardValidityPeriod,
          width: 'half',
          value: ({ externalData }) => {
            const expirationDate =
              getValueViaPath<string>(
                externalData,
                'doctorsNote.data.expirationDate',
              ) ?? ''
            return format(new Date(expirationDate), 'dd.MM.yyyy', {
              locale: is,
            })
          },
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.qualityPhotoTitle,
          width: 'half',
          value: '',
        }),
        buildCustomField({
          id: 'uploadedPhoto',
          component: 'UploadedPhoto',
          condition: (answers) => {
            const qualityPhoto = getValueViaPath<string>(
              answers,
              'photo.qualityPhoto',
            )
            return qualityPhoto === NO || !qualityPhoto
          },
        }),
        buildCustomField({
          id: 'qphoto',
          component: 'QualityPhoto',
          condition: (answers) =>
            getValueViaPath<string>(answers, 'photo.qualityPhoto') === YES,
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: ({ answers }) => {
            return `Þú hefur valið að sækja stæðiskortið sjálf/ur/t hjá: ${getValueViaPath<string>(
              answers,
              'delivery.district',
            )}`
          },
          condition: (answers) =>
            getValueViaPath<string>(answers, 'delivery.deliveryMethod') ===
            PICK_UP,
        }),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: () => m.overviewDeliveryText,
          condition: (answers) =>
            getValueViaPath<string>(answers, 'delivery.deliveryMethod') ===
            SEND_HOME,
        }),
        buildSubmitField({
          id: 'submit',
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
