import {
  buildCustomField,
  // TODO: Uncomment when data providers are implemented
  // buildDataProviderItem,
  // buildExternalDataProvider,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'

import {
  Form,
  FormModes,
  // TODO: Uncomment when data providers are implemented
  // NationalRegistryUserApi,
  // UserProfileApi,
} from '@island.is/application/types'
import * as m from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  children: [
    //* SCREEN/SECTION -- "Forsendur"
    buildSection({
      id: 'prerequisites',
      title: m.prerequisites.intro.sectionTitle,
      children: [
        buildSubSection({
          id: 'prerequisitesIntro',
          title: m.prerequisites.intro.subSectionTitle,
          children: [
            buildMultiField({
              id: 'prerequisitesIntro',
              title: m.prerequisites.intro.pageTitle,
              children: [
                buildCustomField({
                  id: 'prerequisitesIntroDetails',
                  title: m.prerequisites.intro.pageTitle,
                  component: 'GeneralInfoForm',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: m.prerequisites.externalData.sectionTitle,
          children: [
            // TODO: Remove description field when data providers are implemented
            buildDescriptionField({
              id: 'externalDataDummyContent',
              title: 'External data',
              description: 'This is where the external data will be displayed',
            }),
            // TODO: Uncomment when data providers are implemented
            // buildExternalDataProvider({
            //   id: 'approveExternalData',
            //   title: m.prerequisites.externalData.pageTitle,
            //   subTitle: m.prerequisites.externalData.subTitle,
            //   checkboxLabel: m.prerequisites.externalData.checkboxLabel,
            //   dataProviders: [
            //     buildDataProviderItem({
            //       provider: UserProfileApi,
            //       title: m.prerequisites.externalData.currentApplicationTitle,
            //       subTitle:
            //         m.prerequisites.externalData.currentApplicationSubTitle,
            //     }),
            //     buildDataProviderItem({
            //       provider: NationalRegistryUserApi,
            //       title: m.prerequisites.externalData.nationalRegistryTitle,
            //       subTitle:
            //         m.prerequisites.externalData.nationalRegistrySubTitle,
            //     }),
            //   ],
            // }),
          ],
        }),
      ],
    }),

    //* SCREEN/SECTION -- "Húsnæðið"
    buildSection({
      id: 'rentalHousingInfo',
      title: 'Húsnæðið',
      children: [
        //* SUBSECTION -- "Skrá húsnæði"
        buildSubSection({
          id: 'rentalHousingPropertyInfo',
          title: 'Skrá húsnæði',
          children: [
            buildMultiField({
              id: 'rentalHousingPropertyInfo',
              title: 'Húsnæðið',
              description:
                'Finndu eignina með fasteignanúmeri eða heimilisfangi. Nánari upplýsingar er að finna í fasteignaskrá HMS.',
              children: [
                buildTextField({
                  id: 'propertyAddress',
                  title: 'Heimilisfang leiguhúsnæðis',
                  variant: 'text',
                  defaultValue: '',
                  colSpan: '6/12',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "Leigusali"
        buildSubSection({
          id: 'rentalHousingLandlordInfo',
          title: 'Leigusali',
          children: [
            buildMultiField({
              id: 'rentalHousingLandlordInfo',
              title: 'Skrá leigusala',
              children: [
                buildTextField({
                  id: 'rentalHousingLandlordNationalId',
                  title: 'Kennitala leigusala',
                  width: 'half',
                  variant: 'number',
                }),
                buildTextField({
                  id: 'rentalHousingLandlordName',
                  title: 'Fullt nafn',
                  width: 'half',
                  variant: 'text',
                }),
                buildTextField({
                  id: 'rentalHousingLandlordEmail',
                  title: 'Netfang',
                  width: 'half',
                  variant: 'email',
                }),
                buildTextField({
                  id: 'rentalHousingLandlordPhone',
                  title: 'Símanúmer',
                  width: 'half',
                  variant: 'tel',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "Leigjandi"
        buildSubSection({
          id: 'rentalHousingTenantInfo',
          title: 'Leigjandi',
          children: [
            buildMultiField({
              id: 'rentalHousingTenantInfo',
              title: 'Skrá leigjanda',
              children: [
                buildTextField({
                  id: 'rentalHousingTenantNationalId',
                  title: 'Kennitala leigjanda',
                  width: 'half',
                }),
                buildTextField({
                  id: 'rentalHousingTenantName',
                  title: 'Fullt nafn',
                  width: 'half',
                }),
                buildTextField({
                  id: 'rentalHousingTenantEmail',
                  title: 'Netfang',
                  width: 'half',
                }),
                buildTextField({
                  id: 'rentalHousingTenantPhone',
                  title: 'Símanúmer',
                  width: 'half',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "Sérákvæði"
        buildSubSection({
          id: 'rentalHousingSpecialProvisions',
          title: 'Sérákvæði',
          children: [
            buildMultiField({
              id: 'rentalHousingSpecialProvisionsDetails',
              title: 'Nánari lýsing og sérákvæði',
              description:
                'Hér má taka fram hvað fylgir húsnæðinu, hvort húsreglur séu til staðar eða önnur ákvæði sem fylgja samningnum. Athugið að þau ákvæði sem eru andstætt húsaleigulögum munu ekki hafa gildi í túlkun leigusamningsins. Sjá nánar hér.',
              children: [
                buildDescriptionField({
                  id: 'rentalHousingSpecialProvisionsDescriptionTitle',
                  title: 'Lýsing á húsnæðinu og því sem með fylgir',
                  titleTooltip: 'Þetta er tooltip fyrir titilinn',
                  titleVariant: 'h5',
                }),
                buildTextField({
                  id: 'rentalHousingSpecialProvisionsDescriptionInput',
                  title: 'Lýsing á húsnæði',
                  variant: 'textarea',
                  placeholder: 'Skrifaðu hér lýsingu á húsnæðinu',
                }),
              ],
            }),
            buildMultiField({
              id: 'rentalHousingSpecialProvisionsDetails',
              title: 'Nánari lýsing og sérákvæði',
              description:
                'Hér má taka fram hvað fylgir húsnæðinu, hvort húsreglur séu til staðar eða önnur ákvæði sem fylgja samningnum. Athugið að þau ákvæði sem eru andstætt húsaleigulögum munu ekki hafa gildi í túlkun leigusamningsins. Sjá nánar hér.',
              children: [
                buildDescriptionField({
                  id: 'rentalHousingSpecialProvisionsTitle',
                  title: 'Sérákvæði eða húsreglur',
                  titleTooltip: 'Þetta er tooltip fyrir skýringu á þessum reit',
                  titleVariant: 'h5',
                }),
                buildTextField({
                  id: 'rentalHousingSpecialProvisionsInput',
                  title: 'Sérákvæði',
                  variant: 'textarea',
                  placeholder: 'Skrifaðu hér allt sem á við',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "Ástandsskoðun"
        buildSubSection({
          id: 'rentalHousingConditionInspection',
          title: 'Ástandsskoðun',
          children: [
            buildMultiField({
              id: 'rentalHousingConditionInspection',
              title: 'Ástand húsnæðis',
              description:
                'Leigusamningur þarf lögum samkvæmt að innihalda ástandsúttekt á húsnæðinu. Sú úttekt þarf að fara fram við samningsgerðina. Gott er að skoða húsnæðið gaumgæfilega og taka myndir af ástandi. Sjá nánar hér.',
              children: [
                buildRadioField({
                  id: 'rentalHousingConditionInspectionRadio',
                  title: 'Framkvæmdaraðili ástandsskoðunar',
                  width: 'half',
                  description:
                    'Athugið að aðilar geta sjálfir gert ástandsúttekt eða fengið óháðan aðila til þess og þá skiptist kostnaðurinn við það jafnt á milli aðila.',
                  options: [
                    { value: 'contractParties', label: 'Samningsaðilar' },
                    { value: 'independentParty', label: 'Óháður aðili' },
                  ],
                }),
                buildDescriptionField({
                  id: 'rentalHousingConditionInspectionTitle',
                  title: 'Niðurstöður ástandsúttektar',
                  description:
                    'Hér á að setja inn helstu niðurstöður ástandsúttektar. Gott er að taka myndir af þeim atriðum sem skipta máli. Ef óháður aðili hefur framkvæmt úttektina má setja niðurstöðurnar með sem fylgiskjal.',
                  titleVariant: 'h5',
                }),
                buildTextField({
                  id: 'rentalHousingConditionInspectionTextInput',
                  title: 'Ástandsúttekt',
                  variant: 'textarea',
                  placeholder: 'Skrifaður hér allt sem á við',
                }),
                buildFileUploadField({
                  id: 'rentalHousingConditionInspectionFileUpload',
                  title: 'Dragðu skjöl hingað til að hlaða upp',
                  uploadDescription:
                    'Tekið er við skjölum með endingu: .png, .jpg, .jpeg, .pdf, .docx, .rtf. \nSkjöl geta ekki verið stærri en 0 mb og ekki fleiri en 0.',
                  uploadMultiple: true,
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    //* SCREEN/SECTION -- "Tímabil og fjárhæð"
    buildSection({
      id: 'rentalPeriod',
      title: 'Tímabil og fjárhæð',
      children: [
        //* SUBSECTION -- "Leigutímabil"
        buildSubSection({
          id: 'rentalPeriodDetails',
          title: 'Leigutímabil',
          children: [
            buildMultiField({
              title: 'Leigutími',
              children: [
                buildTextField({
                  id: 'rentalPeriodInput',
                  title: 'Leigutími',
                  format: 'text',
                  defaultValue: 'default value',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "Leiguupphæð"
        buildSubSection({
          id: 'rentalPeriodAmount',
          title: 'Leiguupphæð',
          children: [
            buildMultiField({
              id: 'rentalPeriodAmountDetails',
              title: 'Leiguupphæð',
              children: [
                buildTextField({
                  id: 'rentalPeriodAmountInput',
                  title: 'Leiguupphæð',
                  format: 'text',
                  defaultValue: 'default value',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "LeiguTrygging"
        buildSubSection({
          id: 'rentalPeriodSecurityDeposit',
          title: 'LeiguTrygging',
          children: [
            buildMultiField({
              id: 'rentalPeriodSecurityDepositDetails',
              title: 'LeiguTrygging',
              children: [
                buildTextField({
                  id: 'rentalPeriodSecurityDepositInput',
                  title: 'LeiguTrygging',
                  format: 'text',
                  defaultValue: 'default value',
                }),
              ],
            }),
          ],
        }),
        //* SUBSECTION -- "Önnur gjöld"
        buildSubSection({
          id: 'rentalPeriodOtherFees',
          title: 'Önnur gjöld',
          children: [
            buildMultiField({
              id: 'rentalPeriodOtherFeesDetails',
              title: 'Önnur gjöld',
              children: [
                buildTextField({
                  id: 'rentalPeriodOtherFeesInput',
                  title: 'Önnur gjöld',
                  format: 'text',
                  defaultValue: 'default value',
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    //* SCREEN/SECTION -- "Samantekt"
    buildSection({
      id: 'summary',
      title: 'Samantekt',
      children: [],
    }),

    //* SCREEN/SECTION -- "Undirritun"
    buildSection({
      id: 'signing',
      title: 'Undirritun',
      children: [],
    }),
  ],
})
