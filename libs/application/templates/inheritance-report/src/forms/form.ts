import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildDividerField,
  buildExternalDataProvider,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { UserProfile, Application } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'
import { removeCountryCode } from '@island.is/application/ui-components'
import { isEstateInfo } from '../lib/utils/isEstateInfo'
import format from 'date-fns/format'

import {
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const form: Form = buildForm({
  id: 'inheritanceReport',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'dataCollection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi, //'EstateNoticeProvider'
              title: m.deceasedInfoProviderTitle,
              subTitle: m.deceasedInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.personalInfoProviderTitle,
              subTitle: m.personalInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi, //TBD,
              title: m.financialInformationProviderTitle,
              subTitle: m.financialInformationProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.settingsInfoProviderTitle,
              subTitle: m.settingsInfoProviderSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicantsInformation',
      title: m.applicantsInfo,
      children: [
        buildMultiField({
          id: 'applicant',
          title: m.applicantsInfo,
          description: m.applicantsInfoSubtitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return formatNationalId(
                  externalData.nationalRegistry?.data.nationalId,
                )
              },
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              readOnly: true,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                return externalData.nationalRegistry?.data.address.streetAddress
              },
            }),
            buildTextField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
              format: '###-####',
              defaultValue: (application: Application) => {
                const phone =
                  (application.externalData.userProfile?.data as {
                    mobilePhoneNumber?: string
                  })?.mobilePhoneNumber ?? ''

                return removeCountryCode(phone)
              },
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
              defaultValue: ({ externalData }: Application) => {
                const data = externalData.userProfile?.data as UserProfile
                return data?.email
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'inheritanceReportSubmit',
      title: m.irSubmitTitle,
      children: [
        buildMultiField({
          id: 'deceasedInfo',
          title: m.irSubmitTitle,
          description: m.irSubmitSubtitle,
          children: [
            buildKeyValueField({
              label: m.nameOfTheDeceased,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (isEstateInfo(data) ? data.estate.nameOfDeceased : ''),
              width: 'half',
            }),
            buildKeyValueField({
              label: m.nationalId,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateInfo(data)
                  ? formatNationalId(data?.estate.nationalIdOfDeceased)
                  : '',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'spaceDIF',
              space: 'gutter',
              title: '',
            }),
            buildKeyValueField({
              label: m.address,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (isEstateInfo(data) ? data.estate.addressOfDeceased : ''),
              width: 'half',
            }),
            buildKeyValueField({
              label: m.deathDate,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateInfo(data)
                  ? format(new Date(data.estate.dateOfDeath), 'dd/MM/yyyy')
                  : m.deathDateNotRegistered,
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'containerGutter',
            }),
            /*buildCheckboxField({
              id: 'undividedEstate',
              title: '',
              defaultValue: '',
              large: false,
              backgroundColor: 'white',
              options: [
                {
                  value: 'YES',
                  label: 'Arfleifandi sat í óskiptu búi',
                },
              ],
            }),*/
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateProperties',
      title: m.propertiesTitle,
      children: [
        buildSubSection({
          id: 'realEstate',
          title: m.realEstate,
          children: [
            buildMultiField({
              id: 'realEstate',
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'realEstateTitle',
                  title: m.realEstate,
                  description: m.realEstateDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField({
                  title: '',
                  id: 'estate.assets',
                  component: 'RealEstateRepeater',
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
              id: 'realEstate',
              title: m.propertiesTitle,
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
          id: 'inventory',
          title: m.inventoryTitle,
          children: [
            buildMultiField({
              id: 'inventory',
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'membersOfEstateTitle',
                  title: m.inventoryTitle,
                  description: m.inventoryDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField(
                  {
                    title: '',
                    id: 'inventory',
                    component: 'TextFieldsRepeater',
                    doesNotRequireAnswer: true,
                  },
                  {
                    fields: [
                      {
                        title: m.inventoryTextField.defaultMessage,
                        id: 'inventory',
                        placeholder:
                          m.inventoryTextFieldPlaceholder.defaultMessage,
                        variant: 'textarea',
                        rows: 7,
                        width: 'full',
                      },
                      {
                        title: m.inventoryValueTitle.defaultMessage,
                        id: 'inventoryValue',
                        currency: true,
                        width: 'half',
                      },
                    ],
                    repeaterButtonText: m.addInventory.defaultMessage,
                    repeaterHeaderText: m.inventoryTitle.defaultMessage,
                    sumField: 'inventoryValue',
                  },
                ),
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
              title: m.propertiesTitle,
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
                    doesNotRequireAnswer: true,
                  },
                  {
                    fields: [
                      {
                        title: m.bankAccount.defaultMessage,
                        id: 'accountNumber',
                        format: '#### - ## - ######',
                      },
                      {
                        title: m.bankAccountBalance.defaultMessage,
                        id: 'balance',
                        currency: true,
                      },
                    ],
                    repeaterButtonText:
                      m.bankAccountRepeaterButton.defaultMessage,
                    repeaterHeaderText: m.bankAccount.defaultMessage,
                    sumField: 'balance',
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
              title: m.propertiesTitle,
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
                    doesNotRequireAnswer: true,
                  },
                  {
                    fields: [
                      {
                        title: m.claimsPublisher.defaultMessage,
                        id: 'publisher',
                      },
                      {
                        title: m.claimsAmount.defaultMessage,
                        id: 'value',
                        currency: true,
                      },
                    ],
                    repeaterButtonText: m.claimsRepeaterButton.defaultMessage,
                    repeaterHeaderText: m.claimsTitle.defaultMessage,
                    sumField: 'value',
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
              title: m.propertiesTitle,
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
                    doesNotRequireAnswer: true,
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
                        type: 'number',
                      },
                      {
                        title: m.stocksRateOfChange.defaultMessage,
                        id: 'rateOfExchange',
                        type: 'number',
                      },
                      {
                        title: m.stocksValue.defaultMessage,
                        id: 'value',
                        color: 'white',
                        readOnly: true,
                      },
                    ],
                    repeaterButtonText: m.stocksRepeaterButton.defaultMessage,
                    repeaterHeaderText: m.stocksTitle.defaultMessage,
                    sumField: 'value',
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'money',
          title: m.moneyTitle,
          children: [
            buildMultiField({
              id: 'money',
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'moneyTitle',
                  title: m.moneyTitle,
                  description: m.moneyDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField(
                  {
                    title: '',
                    id: 'money',
                    component: 'TextFieldsRepeater',
                    doesNotRequireAnswer: true,
                  },
                  {
                    fields: [
                      {
                        title: m.moneyTitle.defaultMessage,
                        id: 'moneyValue',
                        currency: true,
                      },
                    ],
                    repeaterButtonText: m.addMoney.defaultMessage,
                    repeaterHeaderText: m.moneyTitle.defaultMessage,
                    sumField: 'moneyValue',
                  },
                ),
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
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'otherAssetsTitle',
                  title: m.otherAssetsTitle,
                  description: m.otherAssetsDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField(
                  {
                    title: '',
                    id: 'otherAssets',
                    component: 'TextFieldsRepeater',
                    doesNotRequireAnswer: true,
                  },
                  {
                    fields: [
                      {
                        title: m.otherAssetsText.defaultMessage,
                        id: 'otherAssets',
                        placeholder: m.otherAssetsPlaceholder.defaultMessage,
                        variant: 'textarea',
                        rows: 7,
                        width: 'full',
                      },
                      {
                        title: m.otherAssetsValue.defaultMessage,
                        id: 'otherAssetsValue',
                        currency: true,
                      },
                    ],
                    repeaterButtonText: m.addAsset.defaultMessage,
                    repeaterHeaderText: m.assetHeaderText.defaultMessage,
                    sumField: 'otherAssetsValue',
                  },
                ),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'assetOverview',
      title: 'Yfirlit',
      children: [
        buildMultiField({
          id: 'assetOverview',
          title: 'Yfirlit eigna',
          description:
            'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewRealEstate',
              title: m.realEstate,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Fasteignamat samtals á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewVehicles',
              title: m.vehicles,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Markaðsverð samtals á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewInventory',
              title: m.inventoryTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Markaðsverð samtals á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewBanks',
              title: m.estateBankInfo,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Innistæða í bönkum með vöxtum á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewClaims',
              title: m.claimsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Verðmæti samtals  á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewStocks',
              title: m.stocksTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Verðmæti samtals  á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewMoney',
              title: m.moneyTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Fjárhæð samtals  á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewOtherAssets',
              title: m.otherAssetsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Matsverð annarra eigna samtals á dánardegi',
              value: ({ answers }) => '1.200.000 kr',
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewAllAssetsWorth',
              title: 'Samtals virði eigna',
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Samtals alls',
              value: ({ answers }) => '123.230.000 kr',
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
          description: '',
          children: [
            buildDescriptionField({
              id: 'space_debts',
              space: 'gutter',
              title: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
