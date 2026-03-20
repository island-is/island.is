import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildDescriptionField,
  getValueViaPath,
  buildCheckboxField,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { Delivery } from '../../lib/constants'
import { Jurisdiction } from '@island.is/clients/driving-license'

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
        buildKeyValueField({
          label: m.applicantsName,
          width: 'half',
          value: ({ externalData }: Application) =>
            getValueViaPath(externalData, 'nationalRegistry.data.fullName') ??
            '',
        }),
        buildKeyValueField({
          label: m.applicantsNationalId,
          width: 'half',
          value: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildCustomField({
          id: 'overview.currentLicense',
          component: 'CurrentLicense',
        }),
        buildDividerField({}),
        buildKeyValueField({
          label: m.image,
          value: ({ answers }) => {
            const selectedPhoto = getValueViaPath(answers, 'selectLicensePhoto')
            return selectedPhoto === 'qualityPhoto'
              ? m.overviewPhotoQualityPhoto
              : m.overviewPhotoThjodskra
          },
          width: 'full',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.deliveryTitle',
          title: m.deliveryMethodSectionTitle,
          titleVariant: 'h4',
          description: ({ answers, externalData }) => {
            const deliveryMethod = getValueViaPath(
              answers,
              'delivery.deliveryMethod',
            )
            if (deliveryMethod === Delivery.SEND_HOME) {
              return m.deliverySendHome
            }
            const district = getValueViaPath(answers, 'delivery.district')
            const districts = getValueViaPath<Jurisdiction[]>(
              externalData,
              'jurisdictions.data',
            )
            const selectedDistrict = districts?.find(
              (d) => d.id.toString() === district,
            )
            return `${selectedDistrict?.zip ? selectedDistrict.zip + ' ' : ''}${
              selectedDistrict?.name ?? ''
            }`
          },
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'spacer',
          space: 'gutter',
          title: m.confirmTitle,
          description: m.confirmDescription,
          titleVariant: 'h4',
        }),
        buildCheckboxField({
          id: 'overviewConfirmationCheckbox',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.confirmPhoto,
            },
          ],
          required: true,
        }),
      ],
    }),
  ],
})
