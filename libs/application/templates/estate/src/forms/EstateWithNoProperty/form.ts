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
              title: 'Erfðaskrá og kaupmáli',
              titleVariant: 'h3',
              marginBottom: 'gutter',
            }),
            buildKeyValueField({
              label: 'Erfðaskrá í vörslu sýslumanns',
              value: 'Já',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Kaupmáli',
              value: 'Nei',
              width: 'half',
            }),
            buildKeyValueField({
              label: 'Vitneskja um aðra erfðaskrá',
              value: 'Nei',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'properties',
      title: 'Eignir',
      children: [
        buildMultiField({
          id: 'propertiesInfo',
          title: 'Eignir',
          description:
            'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
          children: [
            buildDescriptionField({
              id: 'propertiesHeader',
              title: 'Fasteignir og lóðir',
              titleVariant: 'h3',
              description: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
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
              title: 'Farartæki',
              titleVariant: 'h3',
              description: 'Til dæmis bifreiðar, flugvélar og bátar',
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
                  label:
                    'Ég samþykki að taka yfir áhvílandi skuldir á þessu farartæki sem vitneskja er um',
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
      title: 'Yfirlit',
      children: [
        buildMultiField({
          id: 'overview',
          title: 'Yfirlit',
          description: 'Þú hefur valið að tilkynna um eignarlaust dánarbú.',
          children: [],
        }),
      ],
    }),
  ],
})
