import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application, DefaultEvents } from '@island.is/application/types'
import { EstateInfo } from '@island.is/clients/syslumenn'
import { formatCurrency } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { YES } from '../../lib/constants'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'

export const overviewSection = buildSection({
  id: 'overview',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewTitle,
      description: m.overviewSubtitleWithoutAssets,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewDeceasedHeader',
          title: m.theDeceased,
          titleVariant: 'h3',
          space: 'gutter',
          marginBottom: 'gutter',
        }),
        ...deceasedInfoFields,
        buildDescriptionField({
          id: 'deceasedFieldsMargin',
          title: '',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'estateMembersHeader',
          title: m.estateMembers,
          titleVariant: 'h3',
          space: 'gutter',
        }),
        buildCustomField(
          {
            title: '',
            id: 'estateMembersCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
          },
          {
            cards: ({ answers }: Application) =>
              (
                ((answers.estate as unknown) as EstateInfo).estateMembers.filter(
                  (member) => member.enabled,
                ) ?? []
              ).map((member) => ({
                title: member.name,
                description: [
                  member.nationalId !== ''
                    ? formatNationalId(member.nationalId)
                    : member.dateOfBirth,
                  member.relation,
                  formatPhoneNumber(member.phone || ''),
                  member.email,
                ],
              })),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'propertiesHeader',
          title: m.realEstate,
          titleVariant: 'h3',
          space: 'gutter',
        }),
        buildCustomField(
          {
            title: '',
            id: 'estateAssetsCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
          },
          {
            cards: ({ answers }: Application) =>
              (
                ((answers.estate as unknown) as EstateInfo).assets.filter(
                  (asset) => asset.enabled,
                ) ?? []
              ).map((asset) => ({
                title: asset.description,
                description: [
                  `${m.propertyNumber.defaultMessage}: ${asset.assetNumber}`,
                  m.overviewMarketValue.defaultMessage +
                    ': ' +
                    (asset.marketValue
                      ? formatCurrency(asset.marketValue)
                      : '0 kr.'),
                ],
              })),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'vehiclesHeader',
          title: m.vehicles,
          titleVariant: 'h3',
          space: 'gutter',
        }),
        buildCustomField(
          {
            title: '',
            id: 'estateVehicleCards',
            component: 'Cards',
            doesNotRequireAnswer: true,
          },
          {
            cards: ({ answers }: Application) =>
              (
                ((answers.estate as unknown) as EstateInfo)?.vehicles?.filter(
                  (vehicle) => vehicle.enabled,
                ) ?? []
              ).map((vehicle) => ({
                title: vehicle.description,
                description: [
                  m.propertyNumber.defaultMessage + ': ' + vehicle.assetNumber,
                  m.overviewMarketValue.defaultMessage +
                    ': ' +
                    (vehicle.marketValue
                      ? formatCurrency(vehicle.marketValue)
                      : '0 kr.'),
                ],
              })),
          },
        ),
        buildCheckboxField({
          id: 'acceptDebts',
          title: '',
          defaultValue: [],
          backgroundColor: 'blue',
          large: true,
          options: [
            {
              label: m.acceptDebtsLabel,
              value: YES,
            },
          ],
        }),
        buildSubmitField({
          id: 'estateWithoutAssets.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
