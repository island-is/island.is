import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildDescriptionField,
  getValueViaPath,
  buildCheckboxField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser } from '@island.is/api/schema'
import { m } from '../../lib/messages'
import format from 'date-fns/format'
import { allowFakeCondition } from '../../lib/utils'
import { IGNORE, YES } from '../../lib/constants'
import {
  DriversLicense,
  Jurisdiction,
} from '@island.is/clients/driving-license'

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
          titleVariant: 'h3',
          title: m.rights,
          space: 'gutter',
        }),
        buildCustomField(
          {
            title: '',
            id: 'currentLicenseCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
            condition: (answers) => {
              return !allowFakeCondition(YES)(answers)
            },
          },
          {
            cards: ({ externalData }: Application) =>
              (
                externalData.currentLicense.data as DriversLicense
              ).categories.map((category) => {
                const isTemporary = category.validToCode === 8
                return {
                  title: `${category.nr} - ${
                    isTemporary
                      ? m.temporaryLicense.defaultMessage
                      : m.generalLicense.defaultMessage
                  }`,
                  description: [
                    category.name,
                    category.expires
                      ? format(new Date(category.expires), 'dd.MM.yyyy')
                      : '',
                  ],
                }
              }) ?? [],
          },
        ),
        buildCustomField(
          {
            id: 'currentLicenseFake',
            title: '',
            component: 'Cards',
            doesNotRequireAnswer: true,
            condition: allowFakeCondition(YES),
          },
          {
            cards: ({ answers }: Application) => {
              const licenseCategory = getValueViaPath<string>(
                answers,
                'fakeData.currentLicense',
              )
              if (licenseCategory === 'B-full') {
                return [
                  {
                    title: 'B - Almenn Ökuréttindi',
                    description: ['Fólksbifreið / Sendibifreið', '04.04.2065'],
                  },
                ]
              } else if (licenseCategory === 'B-temp') {
                return [
                  {
                    title: 'B - Bráðabirgðaskírteini',
                    description: ['Fólksbifreið / Sendibifreið', '04.04.2022'],
                  },
                ]
              }
            },
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
          label: '',
          value: ({ answers: { district }, externalData }) => {
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
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'spacer',
          space: 'gutter',
          title: m.confirmTitle,
          description: m.confirmDescription,
          titleVariant: 'h3',
          marginBottom: 2,
        }),
        buildCheckboxField({
          id: 'overview.confirmationCheckbox',
          title: '',
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
