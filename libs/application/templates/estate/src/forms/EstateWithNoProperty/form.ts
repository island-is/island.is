import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { format as formatNationalId } from 'kennitala'
import { YES } from '../../lib/constants'

export const form: Form = buildForm({
  id: 'estateWithoutProperty',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'estateMembers',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildDescriptionField({
              id: 'estateMembersHeader',
              title: m.estateMembers,
              titleVariant: 'h3',
            }),
            buildCustomField(
              {
                title: '',
                id: 'estateMembersCards',
                component: 'Cards',
              },
              {
                cards: ({ externalData }: Application) =>
                  (
                    (externalData.syslumennOnEntry.data as any)?.estate
                      .estateMembers ?? []
                  ).map((member: any) => ({
                    title: member.name,
                    description: [
                      formatNationalId(member.nationalId),
                      member.relation,
                    ],
                  })),
              },
            ),
            buildDescriptionField({
              id: 'willsHeader',
              title: m.willsAndAgreements,
              titleVariant: 'h3',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: m.willsInCustody,
              value: 'Já',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.agreements,
              value: 'Nei',
              width: 'half',
            }),
            buildKeyValueField({
              label: m.otherWills,
              value: 'Nei',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'properties',
      title: m.properties,
      children: [
        buildMultiField({
          id: 'propertiesInfo',
          title: m.properties,
          description: m.properties,
          children: [
            buildDescriptionField({
              id: 'propertiesHeader',
              title: m.realEstateAndLand,
              titleVariant: 'h3',
              description: m.realEstateAndLandDescription,
            }),
            buildCustomField(
              {
                title: '',
                id: 'estateAssetsCards',
                component: 'Cards',
              },
              {
                cards: ({ externalData }: Application) =>
                  (
                    (externalData.syslumennOnEntry.data as any)?.estate
                      .assets ?? []
                  ).map((asset: any) => ({
                    title: asset.description,
                    description: [asset.assetNumber],
                  })),
              },
            ),
            buildDescriptionField({
              id: 'propertiesHeader',
              title: m.vehicles,
              titleVariant: 'h3',
              description: m.vehiclesDescription,
            }),
            buildCustomField(
              {
                title: '',
                id: 'estateVehicleCards',
                component: 'Cards',
              },
              {
                cards: ({ externalData }: Application) =>
                  (
                    (externalData.syslumennOnEntry.data as any)?.estate
                      .vehicles ?? []
                  ).map((asset: any) => ({
                    title: asset.description,
                    description: [asset.assetNumber],
                  })),
              },
            ),
            buildCheckboxField({
              id: 'acceptDebts',
              title: '',
              defaultValue: '',
              backgroundColor: 'white',
              options: [
                {
                  label: m.acceptDebtsLabel,
                  value: YES,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewTitle,
          description: m.overviewSubtitleWithNoProperty,
          children: [],
        }),
      ],
    }),
  ],
})
