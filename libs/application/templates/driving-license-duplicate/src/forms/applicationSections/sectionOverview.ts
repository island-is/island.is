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
import { NationalRegistryUser } from '@island.is/api/schema'
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
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
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
          id: 'overview.signatureTitle',
          title: m.signature,
          titleVariant: 'h4',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qsignatureOverview',
          component: 'QualitySignature',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.imageTitle',
          title: m.image,
          titleVariant: 'h4',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qphotoOverview',
          component: 'QualityPhoto',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.deliveryTitle',
          title: m.deliveryMethodSectionTitle,
          titleVariant: 'h4',
          description: ({ answers: { district }, externalData }) => {
            const districts = getValueViaPath(
              externalData,
              'jurisdictions.data',
            ) as Jurisdiction[]
            const selectedDistrict = districts.find(
              (d) => d.id.toString() === district,
            )
            const districtPlace = `${
              selectedDistrict?.zip ? selectedDistrict.zip + ' ' : ''
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
          id: 'overview.confirmationCheckbox',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.confirmSignatureAndPhoto,
            },
          ],
          required: true,
        }),
      ],
    }),
  ],
})
