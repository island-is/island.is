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
        buildDescriptionField({
          id: 'overview.deliveryTitle',
          title: m.deliveryMethodSectionTitle,
          titleVariant: 'h4',
          description: ({ answers, externalData }) => {
            const district = getValueViaPath(answers, 'delivery.district')
            const districts = getValueViaPath<Jurisdiction[]>(
              externalData,
              'jurisdictions.data',
            )
            const selectedDistrict = districts?.find(
              (d) => d.id.toString() === district,
            )
            const districtPlace = `${
              selectedDistrict?.zip
                ? selectedDistrict.zip + ' '
                : 'Sent heim í pósti'
            }${selectedDistrict?.name ?? ''}`
            return districtPlace
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
