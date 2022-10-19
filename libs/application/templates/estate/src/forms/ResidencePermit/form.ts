import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'
import { willsAndAgreements } from '../sharedSections/willsAndAgreements'

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
              childInputIds: ['estate.estateMembers'],
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
                //...propertiesFields,
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
                  childInputIds: ['estate.assets'],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'estateContents',
          title: m.estateContents,
          children: [
            buildMultiField({
              id: 'estateContents',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'membersOfEstateTitle',
                  title: m.estateContents,
                  description: m.estateContentsDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'contentsTextarea',
                  title: m.contentsTextField,
                  placeholder: m.contentsTextFieldPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'contentsWorth',
                  title: m.contentsWorth,
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
                  childInputIds: ['estate.vehicles'],
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
                  childInputIds: ['bankAccounts'],
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'claims',
          title: 'Verðbréf og kröfur',
          children: [
            buildMultiField({
              id: 'claims',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'claimsTitle',
                  title: 'Verðbréf og kröfur',
                  description: 'Útgefandi og fjárhæð með vöxtum',
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'publisher',
                  title: 'útgefandi',
                  width: 'half',
                }),
                buildTextField({
                  id: 'amount',
                  title: 'Fjárhæð með vöxtum á dánardegi',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'shares',
          title: 'Hlutabréf',
          children: [
            buildMultiField({
              id: 'shares',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'sharesTitle',
                  title: 'Hlutabréf',
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
        }),
      ],
    }),
    buildSection({
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
    }),
    buildSection({
      id: 'overview',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewTitle,
          description:
            'Þú hefur valið að sækja um búsetuleyfi. Með því að staðfesta þessar upplýsingar staðfestir umsækjandi að hann hafi í lifandi lífi eignarráð á fjármunum búsins og beri ábyrgð á skuldum hins látna sem um hans eigin skuldir væri að ræða, skv. 12. gr. efðalaga nr. 8/1962.',
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewDeceasedHeader',
              title: m.theDeceased,
              titleVariant: 'h3',
              marginBottom: 'gutter',
            }),
            ...deceasedInfoFields,
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
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewEstateMembersHeader',
              title: m.estateMembers,
              titleVariant: 'h3',
              marginBottom: 'gutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
