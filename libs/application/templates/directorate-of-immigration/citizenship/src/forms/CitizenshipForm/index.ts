import { buildActionCardListField, buildAlertMessageField, buildAsyncSelectField, buildCompanySearchField, buildDateField, buildDescriptionField, buildDisplayField, buildDividerField, buildExpandableDescriptionField, buildFieldsRepeaterField, buildFileUploadField, buildForm, buildImageField, buildLinkField, buildMessageWithLinkButtonField, buildMultiField, buildNationalIdWithNameField, buildPaymentChargeOverviewField, buildPdfLinkButtonField, buildPhoneField, buildRadioField, buildSection, buildSelectField, buildSliderField, buildStaticTableField, buildSubmitField, buildTableRepeaterField, buildTextField } from '@island.is/application/core'
import { Form, FormModes, Section } from '@island.is/application/types'
import { confirmation, externalData, payment } from '../../lib/messages'
import { InformationSection } from './InformationSection'
import { PersonalSection } from './PersonalSection'
import { ReviewSection } from './ReviewSection'
import { ChildrenSupportingDocumentsSection } from './ChildrenSupportingDocuments'
import { Logo } from '../../assets/Logo'
import { MAX_CNT_APPLICANTS } from '../../shared'
import { SupportingDocumentsSection } from './SupportingDocumentsSection'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'

const buildSupportingDocumentsSections = (): Section[] => {
  return [...Array(MAX_CNT_APPLICANTS)].map((_key, index) => {
    return ChildrenSupportingDocumentsSection(index)
  })
}

export const CitizenshipForm: Form = buildForm({
  id: 'CitizenshipFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'testEverything',
      title: "Everything!",
      children: [
        buildMultiField({
          id: 'theStuff',
          title: "the stuff",
          children: [
            buildDateField({
              id: 'datefieldid',
              title: 'dateFieldTitle',
              width: 'full',
              placeholder: 'Choose date',
            }),
            buildDescriptionField({
              id: 'descriptionfieldid',
              description: 'Some Description',
              space: 'containerGutter',
              titleVariant: 'h5',
              title: 'DescriptionTitle'
            }),
            buildRadioField({
              id: 'radiofieldid',
              title: '',
              backgroundColor: 'blue',
              required: true,
              options: [
                {
                  value: 'yes',
                  label: 'Yes',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
            }),
            buildSelectField({
              id: 'selectfieldid',
              title: 'selectFieldTitle',
              width: 'full',
              required: true,
              options: [
                {
                  value: 'yes',
                  label: 'Yes',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
            }),
            buildAsyncSelectField({
              id: 'asyncselectfieldid',
              title: 'asyncSelectTitle',
              placeholder: 'Some placeholder',
              width: 'full',
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              loadOptions: async ({ apolloClient }) => {
                return [
                  { label: 'someLabel01', value: 'someValue01' }, 
                  { label: 'someLabel02', value: 'someValue02' }
                ]
              },
            }),
            buildCompanySearchField({
              id: 'companysearchfieldid',
              title: 'companySearchFieldTitle',
              placeholder: 'Some placeholder',
            }),
            buildTextField({
              id: 'textfieldid',
              title: 'textFieldTitle',
              placeholder: 'Some placeholder',
              backgroundColor: 'blue',
              width: 'full',
              format: '##:##',
            }),
            buildPhoneField({
              id: 'phonefieldid',
              title: 'phoneFieldTitle',
              width: 'full',
              required: true,
            }),
            buildFileUploadField({
              id: 'fielduploadfieldid',
              title: 'fieldUploadFieldTitle',
              introduction: '',
              uploadAccept: '.pdf',
              maxSize: 10000000,
              uploadHeader: 'fileUploadHeader',
              uploadDescription: 'filedUploadDescription',
              uploadButtonLabel: 'fileUploadButtonLabel',
            }),
            buildDividerField({
              title: 'DividerField',
            }),
            buildMessageWithLinkButtonField({
              id: 'messagewithlinkbuttonid',
              title: 'messageWithLinkButtonFieldTitle',
              url: '/minarsidur/umsoknir',
              buttonTitle: 'buttonTitle',
              message: 'message',
            }),
            buildExpandableDescriptionField({
              id: 'expandabledescriptionid',
              title: 'expandableDescriptionTitle',
              introText: '',
              description: 'Expandable Description!',
              startExpanded: true,
            }),
            buildAlertMessageField({
              id: 'alertmessagefieldid',
              alertType: 'warning',
              title: 'alertMessageFieldTitle',
              message: 'alert message field alert',
            }),
            buildLinkField({
              id: 'linkfieldid',
              title: 'linkFieldTitle',
              link: 'https://island.is',
              iconProps: { icon: 'open' },
            }),
            buildPaymentChargeOverviewField({
              id: 'paymentchargeoverviewfieldid',
              title: 'paymentChargeOverviewFieldTitle',
              forPaymentLabel: 'forPaymentLabel',
              totalLabel: 'totalLabel',
              getSelectedChargeItems: () => [{
                chargeItemCode: 'someCode',
                extraLabel: 'extra label',
              }],
            }),
            buildImageField({
              id: 'imagefieldid',
              title: 'imageFieldTitle',
              image: Logo,
              imageWidth: ['full', 'full', '50%', '50%'],
              imagePosition: 'center',
            }),
            buildPdfLinkButtonField({
              id: 'pdflinkbuttonfieldid',
              title: 'pdfLinkButtonFieldTitle',
              verificationDescription: '',
              verificationLinkTitle: '',
              verificationLinkUrl: '',
              getPdfFiles: () => {
                return [
                  {
                    base64: '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e8F3xce0xfnFUjAIcWFRGjm2r0uI5y2t11EEtbU1oVB1lUfMVfLyqqtCTyxzIlK7UltSwmy9ad49Mvv6T3eSfu6M/kqsel/MvD70kYcpdMW8SPmr6PPkpHnHTG797FLzs+oP7LdffJB17AT9GZBfGdpOmmNJR4szlR9rgXxDOqLtiYQ9h53zd7kaModskCBq8CsKUvcpJzUHjsRxC3PgieBJknjOkrY5IZ6/tMEcqznIzfU6nX7S7DIv7bG2hn6fnWO3JmeRePjX92+a986dnjh26uuJd75iVn9q6ub3ZuYnDyZQ1UP32Ruzl43ZG+wE9HB9MME9DW3oTzjJvQs7MQQasbtZjSN0XJtG82/hNwvibrajPYhRQJaj/RGMOoOYCWC0RgliNiA3YLa4YZvq12Rd1jf36HKD3NfVg7liy5KDXl2rkDG0qP0EW1UFhzXpEe3VtLog5mgazkqjayTBnlSCPVYCEp8MYkegUcZsSbP6gorHIxIORzRJUeQonmlW8UxEUjQtiJ2PapTtn4pVbVoAO9cEscvO0KLisIRB03Vb+RU8ruuSTjpY0DP/19MIHt8IL90gE4hOo/Fm62Tcr0h0w6/4FVKhFglid6CxRY2SEhVSYnoAl0aDOCOAy4jhA/HVKCbrLWoiDBx0T7sg1qomoJS9PaRJ2E+Sy7FpAR7t0S4zAzgcm5Zhhxovg4iUgDL2dkQL/ge8WABYCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDE4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMTcxNyAwMDAwMCBuIAowMDAwMDAxNzc0IDAwMDAwIG4gCjAwMDAwMDE2NTUgMDAwMDAgbiAKMDAwMDAwMTYzNCAwMDAwMCBuIAowMDAwMDAwMjkyIDAwMDAwIG4gCjAwMDAwMDAxNzUgMDAwMDAgbiAKMDAwMDAwMDA2NSAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDE0ODYgMDAwMDAgbiAKMDAwMDAwMDU3MSAwMDAwMCBuIAowMDAwMDAwNDgzIDAwMDAwIG4gCjAwMDAwMDA1MDkgMDAwMDAgbiAKMDAwMDAwMDUzNSAwMDAwMCBuIAowMDAwMDAxODIxIDAwMDAwIG4gCjAwMDAwMDA2NDcgMDAwMDAgbiAKMDAwMDAwMDkxMyAwMDAwMCBuIAowMDAwMDAxMTc3IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMTgKL1Jvb3QgMyAwIFIKL0luZm8gMTAgMCBSCi9JRCBbPGI5MTZkYjViNWExYTg1N2E4MDZhNjM4MGM1ODg0Zjk3PiA8YjkxNmRiNWI1YTFhODU3YTgwNmE2MzgwYzU4ODRmOTc+XQo+PgpzdGFydHhyZWYKMzI1OAolJUVPRgo=',
                    filename: 'tiny.pdf',
                    buttonText: 'The pdf'
                  }
                ]
              },
              viewPdfFile: true,
            }),
            /*
            buildNationalIdWithNameField({}),
            buildActionCardListField({}),
            buildTableRepeaterField({}),
            buildFieldsRepeaterField({}),
            buildStaticTableField({}),
            buildSliderField({}),
            buildDisplayField({}),
            buildSubmitField({}),
            */
          ]
        })
      ],
    }),
    PersonalSection,
    InformationSection,
    SupportingDocumentsSection,
    ...buildSupportingDocumentsSections(),
    ReviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
