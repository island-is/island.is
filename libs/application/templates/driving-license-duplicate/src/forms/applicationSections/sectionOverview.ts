import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import {
  DistrictCommissionerAgencies,
  NationalRegistryUser,
} from '@island.is/api/schema'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { allowFakeCondition } from '../../lib/utils'
import { NO, YES } from '../../lib/constants'
import { DriversLicense } from '@island.is/clients/driving-license'

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
        buildDescriptionField({
          id: 'overview.informationTitle',
          title: m.informationTitle,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
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
        buildDescriptionField({
          id: 'overview.currentLicenseTitle',
          title: m.rights,
        }),
        buildCustomField(
          {
            title: '',
            id: 'currentLicenseCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
          },
          {
            cards: ({ externalData }: Application) =>
              (externalData.currentLicense
                .data as DriversLicense).categories.map((category) => ({
                title: category.nr,
                description: [
                  category.name,
                  category.expires
                    ? format(new Date(category.expires), 'dd.MM.yyyy')
                    : '',
                ],
              })) ?? [],
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.signatureTitle',
          title: m.signature,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qsignatureOverview',
          title: '',
          component: 'QualitySignature',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.imageTitle',
          title: m.image,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildCustomField({
          id: 'qphotoOverview',
          title: '',
          component: 'QualityPhoto',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overview.deliveryTitle',
          title: m.deliveryMethodSectionTitle,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildKeyValueField({
          label: m.deliveryMethodTitle,
          value: ({ answers: { district }, externalData }) => {
            const districts = getValueViaPath(
              externalData,
              'districtCommissioners.data',
            ) as DistrictCommissionerAgencies[]
            const selectedDistrict = districts.find((d) => d.id === district)
            const districtName = selectedDistrict?.name ?? ''
            const districtPlace = selectedDistrict?.place ?? ''
            return `${districtName}, ${districtPlace}`
          },
        }),
      ],
    }),
  ],
})
