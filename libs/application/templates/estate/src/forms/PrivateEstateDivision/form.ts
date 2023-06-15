import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  FILE_SIZE_LIMIT,
  JA,
  NEI,
  NO,
  UPLOAD_ACCEPT,
  YES,
} from '../../lib/constants'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { overview } from './overviewSection'
import { testamentInfo } from '../sharedSections/testamentInfo'
import { deceasedInfoFields } from '../sharedSections/deceasedInfoFields'

/* This form is being used for "Einkaskipti" */
export const form: Form = buildForm({
  id: 'privateEstateDivision',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'deceased',
      title: 'Hinn látni',
      children: [
        buildMultiField({
          id: 'deceased',
          title: 'Hinn látni',
          description: 'Trolo',
          children: [
            ...deceasedInfoFields,
            buildDescriptionField({
              id: 'space0',
              space: 'containerGutter',
              title: '',
            }),
            buildRadioField({
              id: 'deceasedWithUndividedEstate.selection',
              title: 'Sat hinn látni í óskiptu búi?',
              width: 'half',
              largeButtons: false,
              options: [
                { label: JA, value: YES },
                { label: NEI, value: NO },
              ],
            }),
            buildDescriptionField({
              id: 'deceasedSpouse',
              space: 'containerGutter',
              title: 'Maki hins látna',
              titleVariant: 'h4',
              marginBottom: 2,
              condition: (answers) =>
                getValueViaPath(
                  answers,
                  'deceasedWithUndividedEstate.selection',
                ) === YES,
            }),
            buildCustomField({
              id: 'deceasedWithUndividedEstate.spouse',
              title: '',
              component: 'LookupPerson',
              condition: (answers) =>
                getValueViaPath(
                  answers,
                  'deceasedWithUndividedEstate.selection',
                ) === YES,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateMembersInfo',
      title: m.estateMembers,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembers,
          description: m.estateMembersSubtitle,
          children: [
            buildCustomField({
              title: '',
              id: 'estate.estateMembers',
              component: 'EstateMembersRepeater',
            }),
            buildDescriptionField({
              id: 'space2',
              title: '',
              space: 'containerGutter',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'testamentInfo',
      title: m.willsAndAgreements,
      children: [testamentInfo],
    }),
    buildSection({
      id: 'estateProperties',
      title: m.properties,
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
                buildTextField({
                  id: 'inventory.info',
                  title: m.inventoryTextField,
                  placeholder: m.inventoryTextFieldPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'inventory.value',
                  title: m.inventoryValueTitle,
                  width: 'half',
                  variant: 'currency',
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
                buildCustomField(
                  {
                    title: '',
                    id: 'estate.vehicles',
                    component: 'AssetsRepeater',
                  },
                  {
                    assetName: 'vehicles',
                    texts: {
                      assetTitle: m.vehiclesTitle,
                      assetNumber: m.vehicleNumberLabel,
                      assetType: m.vehicleTypeLabel,
                      addAsset: m.addVehicle,
                    },
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'guns',
          title: m.guns,
          children: [
            buildMultiField({
              id: 'realEstate',
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'gunsTitle',
                  title: m.guns,
                  description: m.gunsDescription,
                  titleVariant: 'h3',
                }),
                buildCustomField(
                  {
                    title: '',
                    id: 'estate.guns',
                    component: 'AssetsRepeater',
                  },
                  {
                    assetName: 'guns',
                    texts: {
                      assetTitle: m.gunTitle,
                      assetNumber: m.gunNumberLabel,
                      assetType: m.gunTypeLabel,
                      addAsset: m.addGun,
                    },
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
                  },
                  {
                    fields: [
                      {
                        title: m.stocksOrganization.defaultMessage,
                        id: 'organization',
                      },
                      {
                        title: m.stocksNationalId.defaultMessage,
                        id: 'nationalId',
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
                        backgroundColor: 'white',
                        readOnly: true,
                      },
                    ],
                    repeaterButtonText: m.stocksRepeaterButton.defaultMessage,
                    repeaterHeaderText: m.stocksTitle.defaultMessage,
                  },
                ),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'moneyAndDeposit',
          title: m.moneyAndDepositTitle,
          children: [
            buildMultiField({
              id: 'moneyAndDeposit',
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'moneyAndDepositTitle',
                  title: m.moneyAndDepositTitle,
                  description: m.moneyAndDepositDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'moneyAndDeposit.info',
                  title: m.moneyAndDepositText,
                  placeholder: m.moneyAndDepositPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'moneyAndDeposit.value',
                  title: m.moneyAndDepositValue,
                  width: 'half',
                  variant: 'currency',
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
              title: m.propertiesTitle,
              description: m.propertiesDescription,
              children: [
                buildDescriptionField({
                  id: 'otherAssetsTitle',
                  title: m.otherAssetsTitle,
                  description: m.otherAssetsDescription,
                  titleVariant: 'h3',
                }),
                buildTextField({
                  id: 'otherAssets.info',
                  title: m.otherAssetsText,
                  placeholder: m.otherAssetsPlaceholder,
                  variant: 'textarea',
                  rows: 7,
                }),
                buildTextField({
                  id: 'otherAssets.value',
                  title: m.otherAssetsValue,
                  width: 'half',
                  variant: 'currency',
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
                    title: m.debtsNationalId.defaultMessage,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.debtsLoanIdentity.defaultMessage,
                    id: 'loanIdentity',
                  },
                  {
                    title: m.debtsBalance.defaultMessage,
                    id: 'balance',
                    currency: true,
                  },
                ],
                repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
                repeaterHeaderText: m.debtsCreditorHeader.defaultMessage,
              },
            ),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateAttachments',
      title: m.attachmentsTitle,
      children: [
        buildMultiField({
          id: 'estateAttachments',
          title: m.attachmentsTitle,
          description: m.attachmentsDescription,
          children: [
            buildFileUploadField({
              id: 'estateAttachments.attached.file',
              title: m.attachmentsTitle,
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: m.uploadHeader,
              uploadDescription: m.uploadDescription,
              uploadMultiple: true,
              maxSize: FILE_SIZE_LIMIT,
              uploadButtonLabel: m.attachmentsButton,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'representative',
      title: m.representativeTitle,
      children: [
        buildMultiField({
          id: 'representative',
          title: m.representativeTitle,
          description: m.representativeDescription,
          children: [
            buildCustomField(
              {
                title: '',
                id: 'representative',
                component: 'LookupPerson',
              },
              {
                requiredNationalId: false,
              },
            ),
            buildTextField({
              id: 'representative.phone',
              title: m.phone,
              width: 'half',
              format: '###-####',
            }),
            buildTextField({
              id: 'representative.email',
              title: m.email,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveSubmission',
      title: m.divisionOfEstateByHeirsTerms,
      children: [
        buildMultiField({
          id: 'approveSubmission',
          title: m.divisionOfEstateByHeirsTerms,
          description: m.divisionOfEstateByHeirsText,
          children: [
            buildDescriptionField({
              id: 'space3',
              title: '',
              space: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'confirmAction',
              title: '',
              large: false,
              backgroundColor: 'white',
              defaultValue: [],
              options: [
                {
                  value: YES,
                  label:
                    m.divisionOfEstateByHeirsSubmissionCheckbox.defaultMessage,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    overview,
  ],
})
