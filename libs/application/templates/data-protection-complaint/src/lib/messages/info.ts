import { defineMessages } from 'react-intl'

// Confirmation
export const info = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.info.pageTitle',
      defaultMessage: 'Fyrir hvern ertu að senda inn kvörtun?',
      description: 'Info page title',
    },
    description: {
      id: 'dpac.application:section.info.description',
      defaultMessage: 'Vantar textaupplýsingar',
      description: 'Info page description',
    },
    applicantPageTitle: {
      id: 'dpac.application:section.info.applicantPageTitle',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant page title',
    },
    applicantPageDescription: {
      id: 'dpac.application:section.info.applicantPageDescription',
      defaultMessage: 'Vinsamlegast fylltu út þínar persónuupplýsingar',
      description: 'Applicant page description',
    },
    organizationOrInstitutionPageTitle: {
      id: 'dpac.application:section.info.organizationOrInstitutionPageTitle',
      defaultMessage: 'Fylltu út upplýsingar um Félagssamtök / stofnun',
      description: 'Organization or Institution page title',
    },
    organizationOrInstitutionPageDescription: {
      id:
        'dpac.application:section.info.organizationOrInstitutionPageDescription',
      defaultMessage: 'Vinsamlegast fylltu út uppýsingar',
      description: 'Organization or Institution page description',
    },
    commissionsPageTitle: {
      id: 'dpac.application:section.info.commissionsPageTitle',
      defaultMessage: 'Umboð og upplýsingar fyrir annan en sjálfan þig',
      description: 'Commissions page title',
    },
    commissionsPageDescription: {
      id: 'dpac.application:section.info.commissionsPageDescriptions',
      defaultMessage: `Til þess að senda inn kvörtun fyrir annan en þig sjálfan þarft þú skila inn umboðskjali. Þegar þú hefur fyllt út umboðsskjalið þá þarftu að hlaða því upp hér.
      Þú getur sótt umboðsskjal hér til útfyllingar.`,
      description: 'Commissions page description',
    },
  }),
  labels: defineMessages({
    myself: {
      id: 'dpac.application:section.info.myself',
      defaultMessage: 'Mig',
      description: 'Myself',
    },
    myselfAndOrOthers: {
      id: 'dpac.application:section.info.myselfAndOrOthers',
      defaultMessage: 'Mig ásamt öðrum / í umboði',
      description: 'Myself and others',
    },
    company: {
      id: 'dpac.application:section.info.company',
      defaultMessage: 'Fyrirtæki',
      description: 'Company',
    },
    organizationInstitution: {
      id: 'dpac.application:section.info.organizationInstitution',
      defaultMessage: 'Félagasamtök / stofnun',
      description: 'Organization or institution',
    },
    name: {
      id: 'dpac.application:section.info.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: 'dpac.application:section.info.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: 'dpac.application:section.info.address',
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: 'dpac.application:section.info.postalCode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: 'dpac.application:section.info.city',
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: 'dpac.application:section.info.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: 'dpac.application:section.info.tel',
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
    organizationOrInstitutionName: {
      id: 'dpac.application:section.info.organizationOrInstitutionName',
      defaultMessage: 'Nafn félagssamtaka',
      description: 'Organization or institution name',
    },
    commissionsDocumentsHeader: {
      id: 'dpac.application:section.info.commissionsDocumentsHeader',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Header of the commissions file upload field',
    },
    commissionsDocumentsDescription: {
      id: 'dpac.application:section.info.commissionsDocumentsDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Description of the commissions file upload field',
    },
    commissionsDocumentsButtonLabel: {
      id: 'dpac.application:section.info.commissionsDocumentsButtonLabel',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Label of the commissions file upload field button',
    },
  }),
}
