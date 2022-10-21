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
                buildCustomField(
                  {
                    title: '',
                    id: 'bankAccounts',
                    component: 'TextFieldsRepeater',
                  },
                  {
                    fields: [
                      {
                        title: m.bankAccount.defaultMessage,
                        id: 'accountNumber',
                        placeholder: m.bankAccountPlaceholder.defaultMessage,
                        format: '#### - ## - ######',
                      },
                      {
                        title: m.bankAccountBalance.defaultMessage,
                        id: 'balance',
                      },
                    ],
                    repeaterButtonText:
                      m.bankAccountRepeaterButton.defaultMessage,
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
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
                buildCustomField(
                  {
                    title: '',
                    id: 'claims',
                    component: 'TextFieldsRepeater',
                  },
                  {
                    fields: [
                      {
                        title: m.claimsPublisher.defaultMessage,
                        id: 'publisher',
                      },
                      { title: m.claimsAmount.defaultMessage, id: 'value' },
                    ],
                    repeaterButtonText: m.claimsRepeaterButton.defaultMessage,
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'stocks',
          title: m.stocksTitle,
          children: [
            buildMultiField({
              id: 'stocks',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'stocksTitle',
                  title: m.stocksTitle,
                  description: m.stocksDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField(
                  {
                    title: '',
                    id: 'stocks',
                    component: 'TextFieldsRepeater',
                  },
                  {
                    fields: [
                      {
                        title: m.stocksOrganization.defaultMessage,
                        id: 'organization',
                      },
                      {
                        title: m.stocksSsn.defaultMessage,
                        id: 'ssn',
                        format: '######-####',
                      },
                      {
                        title: m.stocksFaceValue.defaultMessage,
                        id: 'faceValue',
                      },
                      {
                        title: m.stocksRateOfChange.defaultMessage,
                        id: 'rateOfExchange',
                      },
                      {
                        title: m.stocksValue.defaultMessage,
                        id: 'value',
                        color: 'white',
                      },
                    ],
                    repeaterButtonText: m.stocksRepeaterButton.defaultMessage,
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'moneyAndDedosit',
          title: m.moneyAndDepositTitle,
          children: [
            buildMultiField({
              id: 'moneyAndDedosit',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'moneyAndDedositTitle',
                  title: m.moneyAndDepositTitle,
                  description: m.moneyAndDepositDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'moneyAndDepositBoxesInfo',
                  title: m.moneyAndDepositText,
                  placeholder: m.moneyAndDepositPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'moneyAndDepositBoxesValue',
                  title: m.moneyAndDepositValue,
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'otherAssets',
          title: m.otherAssetsTitle,
          children: [
            buildMultiField({
              id: 'otherAssets',
              title: m.properties,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'otherAssetsTitle',
                  title: m.otherAssetsTitle,
                  description: m.otherAssetsDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'otherAssets',
                  title: m.otherAssetsText,
                  placeholder: m.otherAssetsPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'otherAssetsValue',
                  title: m.otherAssetsValue,
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
      title: m.debtsTitle,
      children: [
        buildMultiField({
          id: 'debts',
          title: m.debtsTitle,
          description: m.debtsDescription,
          children: [
            buildCustomField(
              {
                title: '',
                id: 'debts',
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsCreditorName.defaultMessage,
                    id: 'creditorName',
                  },
                  {
                    title: m.debtsSsn.defaultMessage,
                    id: 'ssn',
                    format: '######-####',
                  },
                  { title: m.debtsBalance.defaultMessage, id: 'balance' },
                ],
                repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
              },
            ),
          ],
        }),
      ],
    }),
    overview,
  ],
})
