import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { willsAndAgreements } from '../sharedSections/willsAndAgreements'
import { overview } from './overviewSection'

export const form: Form = buildForm({
  id: 'residencePermitForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'estateMembersInfo',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildDescriptionField({
              id: 'membersOfEstateTitle',
              title: m.estateMembers,
              description: m.estateMembersHeaderDescription,
              titleVariant: 'h3',
            }),
            buildCustomField({
              title: '',
              id: 'estate.estateMembers',
              component: 'EstateMembersRepeater',
            }),
            ...willsAndAgreements,
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateProperties',
      title: m.properties,
      children: [
        buildSubSection({
          id: 'realEstateAndLand',
          title: m.realEstateAndLand,
          children: [
            buildMultiField({
              id: 'realEstateAndLand',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'realEstateAndLandsTitle',
                  title: m.realEstateAndLand,
                  description: m.realEstateAndLandDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField({
                  title: '',
                  id: 'estate.assets',
                  component: 'RealEstateAndLandsRepeater',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'inventory',
          title: m.inventoryTitle,
          children: [
            buildMultiField({
              id: 'inventory',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'membersOfEstateTitle',
                  title: m.inventoryTitle,
                  description: m.inventoryDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'inventory',
                  title: m.inventoryTextField,
                  placeholder: m.inventoryTextFieldPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'inventoryValue',
                  title: m.inventoryValueTitle,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'vehicles',
          title: m.vehicles,
          children: [
            buildMultiField({
              id: 'realEstateAndLand',
              title: m.vehicles,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'vehiclesTitle',
                  title: m.vehicles,
                  description: m.vehiclesDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField({
                  title: '',
                  id: 'estate.vehicles',
                  component: 'VehiclesRepeater',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'estateBankInfo',
          title: m.estateBankInfo,
          children: [
            buildMultiField({
              id: 'estateBankInfo',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'estateBankInfoTitle',
                  title: m.estateBankInfo,
                  description: m.estateBankInfoDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField({
                  title: '',
                  id: 'bankAccounts',
                  component: 'BankAccountsRepeater',
                }),
              ],
            }),
          ],
        }),
        /*buildSubSection({
          id: 'claims',
          title: m.claimsTitle,
          children: [
            buildMultiField({
              id: 'claims',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'claimsTitle',
                  title: m.claimsTitle,
                  description: m.claimsDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'claimsPublisher',
                  title: m.claimsPublisher,
                  width: 'half',
                }),
                buildTextField({
                  id: 'claimsAmount',
                  title: m.claimsAmount,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'shares',
          title: m.sharesTitle,
          children: [
            buildMultiField({
              id: 'shares',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'sharesTitle',
                  title: m.sharesTitle,
                  description: m.sharesDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'temp',
                  title: 'Text',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'bankVaults',
          title: 'Peningar og bankahólf',
          children: [
            buildMultiField({
              id: 'bankVaults',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'bankValutsTitle',
                  title: 'Peningar og bankahólf',
                  description: 'Nafn og kennitala ef um einstakling er að ræða',
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'temp',
                  title: 'Text',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherEstates',
          title: 'Aðrar eignir',
          children: [
            buildMultiField({
              id: 'otherEstates',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'otherEstatesTitle',
                  title: 'Aðrar eignir',
                  description: 'Til dæmis hugverkaréttindi, búseturéttur o.fl.',
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'otherEstatesTextarea',
                  title: 'Upplýsingar um aðrar eignir',
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'otherEstatesWorth',
                  title: 'Fjárhæð á dánardegi',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),*/
      ],
    }),
    /*buildSection({
      id: 'debts',
      title: 'Skuldir',
      children: [
        buildMultiField({
          id: 'debts',
          title: 'Skuldir',
          description: 'Innlendar og erlendar skuldir',
          children: [
            buildTextField({
              id: 'temp',
              title: 'Text',
              width: 'half',
            }),
            buildTextField({
              id: 'temp',
              title: 'Text',
              width: 'half',
            }),
            buildTextField({
              id: 'temp',
              title: 'Text',
              width: 'half',
            }),
          ],
        }),
      ],
    }),*/
    overview,
  ],
})
