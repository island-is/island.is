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
import {
  NationalRegistryUser,
  UserProfile,
  DistrictCommissionerAgencies,
} from '../../types/schema'
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

        buildDividerField({}),
        // buildKeyValueField({
        //   label: m.cardValidityPeriod,
        //   width: 'half',
        //   value: ({ externalData: { doctorsNote } }) =>
        //     format(
        //       new Date((doctorsNote.data as any).expirationDate),
        //       'dd/MM/yyyy',
        //       { locale: is },
        //     ),
        // }),
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
