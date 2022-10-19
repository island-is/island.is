import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import { EstateAsset, EstateMember } from '@island.is/clients/syslumenn'
import { m } from '../../lib/messages'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'
import { willsAndAgreements } from '../sharedSections/willsAndAgreements'
import { format as formatNationalId } from 'kennitala'

export const overview = buildSection({
  id: 'overview',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewTitle,
      description: m.overviewSubtitleResidencePermit,
      children: [
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewDeceasedHeader',
          title: m.theDeceased,
          titleVariant: 'h3',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        ...deceasedInfoFields,
        buildDescriptionField({
          id: 'space',
          title: '',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewEstateMembersHeader',
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
              ((answers.estate as any).estateMembers ?? []).map(
                (member: EstateMember) => ({
                  title: member.name,
                  description: [
                    formatNationalId(member.nationalId),
                    member.relation,
                  ],
                }),
              ),
          },
        ),
        ...willsAndAgreements,
        buildDescriptionField({
          id: 'space1',
          title: '',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewEstateAndLandsHeader',
          title: m.realEstateAndLand,
          description: m.realEstateAndLandDescription,
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
              ((answers.estate as any).assets ?? []).map(
                (asset: EstateAsset) => ({
                  title: asset.description,
                  description: [asset.assetNumber],
                }),
              ),
          },
        ),
        buildDescriptionField({
          id: 'space2',
          title: '',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'overviewInventoryHeader',
          title: m.inventoryTitle,
          description: m.inventoryDescription,
          titleVariant: 'h3',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewInventory',
          title: m.inventoryTextField,
          description: (application: Application) =>
            application.answers.inventory as string,
          titleVariant: 'h4',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewInventoryValue',
          title: m.inventoryValueTitle,
          description: (application: Application) =>
            application.answers.inventoryValue as string,
          titleVariant: 'h4',
          marginBottom: 'gutter',
          space: 'gutter',
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'space3',
          title: '',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewVehicles',
          title: m.vehicles,
          description: m.vehiclesDescription,
          titleVariant: 'h3',
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
              ((answers.estate as any)?.vehicles ?? []).map(
                (vehicle: EstateAsset) => ({
                  title: vehicle.description,
                  description: [vehicle.assetNumber],
                }),
              ),
          },
        ),
        buildDividerField({}),
        buildDescriptionField({
          id: 'space4',
          title: '',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'overviewEstateBankInfoTitle',
          title: m.estateBankInfo,
          description: m.estateBankInfoDescription,
          titleVariant: 'h3',
        }),
        buildSubmitField({
          id: 'residencePermit.submit',
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
