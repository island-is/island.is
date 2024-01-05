import { defineMessages } from 'react-intl'

export const info = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.info.pageTitle',
      defaultMessage: 'Fyrir hvern ertu að senda inn kvörtun?',
      description: 'Info page title',
    },
    description: {
      id: 'dpac.application:section.info.description#markdown',
      defaultMessage:
        'Hægt er að senda inn kvörtun í eigin nafni eða fyrir aðra einstaklinga sem þú ert með skriflegt umboð frá. Foreldrar og forráðamenn geta líka sent inn kvörtun fyrir hönd barna sem þeir fara með forsjá yfir.\n \n Stofnanir, samtök og félög sem eru virk á sviði persónuverndar geta einnig sent inn kvörtun án umboðs að uppfylltum skilyrðum 80. gr. reglugerðar (ESB) 2016/679 (almennu persónuverndarreglugerðarinnar).',
      description: 'Info page description',
    },
    applicantPageTitle: {
      id: 'dpac.application:section.info.applicantPageTitle',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Applicant page title',
    },
    applicantPageDescription: {
      id: 'dpac.application:section.info.applicantPageDescription#markdown',
      defaultMessage:
        'Persónuvernd þarf þessar upplýsingar til þess að hægt sé að hafa samband við þig á meðan málið er til meðferðar og upplýsa þig um niðurstöðu þess, og til þess að tryggja örugga persónugreiningu.\n \n Þær upplýsingar sem eru stjörnumerktar þarf alltaf að gefa upp. Annað er valkvætt.',
      description: 'Applicant page description',
    },
    organizationOrInstitutionPageTitle: {
      id: 'dpac.application:section.info.organizationOrInstitutionPageTitle',
      defaultMessage:
        'Upplýsingar um stofnun, samtök eða félag sem stendur að baki kvörtuninni',
      description: 'Organization or Institution page title',
    },
    organizationOrInstitutionPageDescription: {
      id: 'dpac.application:section.info.organizationOrInstitutionPageDescription#markdown',
      defaultMessage:
        'Persónuvernd þarf þessar upplýsingar til þess að hægt sé að hafa samband á meðan málið er til meðferðar og upplýsa þig um niðurstöðu þess.\n\nÞær upplýsingar sem eru stjörnumerktar þarf alltaf að gefa upp. Upplýsingar um netfang og símanúmer eru valkvæðar en það getur flýtt fyrir afgreiðslu kvörtunarinnar ef þær eru veittar.',
      description: 'Organization or Institution page description',
    },
    commissionsPageTitle: {
      id: 'dpac.application:section.info.commissionsPageTitle',
      defaultMessage: 'Upplýsingar um umboð',
      description: 'Commissions page title',
    },
    commissionsPageDescriptionOfDocumentTextOne: {
      id: 'dpac.application:section.info.commissionsPageDescriptions',
      defaultMessage: `Ef kvörtunin er sett fram fyrir hönd einhvers annars
      þarftu að skila inn skriflegu og undirrituðu umboði frá viðkomandi
      aðila og skila því inn sem fylgiskjali með kvörtuninni.`,
      description: 'Commissions page document description first paragraph',
    },
    commissionsPageDescriptionOfDocumentTextTwo: {
      id: 'dpac.application:section.info.commissionsPageDescriptionLink',
      defaultMessage: `Þú getur sótt umboðsskjal hér til útfyllingar.`,
      description:
        'Commissions page document description text second paragraph',
    },
    comissionPageButtonName: {
      id: 'dpac.application:section.info.comissionPageButtonName',
      defaultMessage: `Umboð.docx.`,
      description: 'Button title for document provided for power of attorney',
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
      defaultMessage: 'Mig og aðra (með umboð)',
      description: 'Myself and others',
    },
    others: {
      id: 'dpac.application:section.info.others',
      defaultMessage: 'Í umboði fyrir aðra',
      description: 'Others',
    },
    organizationInstitution: {
      id: 'dpac.application:section.info.organizationInstitution',
      defaultMessage: 'Stofnun, samtök eða félag',
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
    contactName: {
      id: 'dpac.application:section.info.contactName',
      defaultMessage: 'Nafn',
      description: 'Contact name',
    },
    organizationOrInstitutionName: {
      id: 'dpac.application:section.info.organizationOrInstitutionName',
      defaultMessage: 'Nafn stofnunar/samtaka/félags',
      description: 'Organization or institution name',
    },
    contactTitle: {
      id: 'dpac.application:section.info.contactTitle',
      defaultMessage: 'Tengiliður',
      description: 'Contact title',
    },
    commissionDocuments: {
      id: 'dpac.application:section.info.commissionDocuments',
      defaultMessage: 'Umboðsskjöl',
      description: 'Commission Documents',
    },
    commissionsDocumentsHeader: {
      id: 'dpac.application:section.info.commissionsDocumentsHeader',
      defaultMessage: 'Dragðu umboðsskjöl hingað til að hlaða upp',
      description: 'Header of the commissions file upload field',
    },
    commissionsDocumentsDescription: {
      id: 'dpac.application:section.info.commissionsDocumentsDescription',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf, .docx, .rtf',
      description: 'Description of the commissions file upload field',
    },
    commissionsDocumentsButtonLabel: {
      id: 'dpac.application:section.info.commissionsDocumentsButtonLabel',
      defaultMessage: 'Velja umboðsskjöl til að hlaða upp',
      description: 'Label of the commissions file upload field button',
    },
    commissionsPerson: {
      id: 'dpac.application:section.info.commissionsPerson',
      defaultMessage: 'Upplýsingar um umbjóðanda (þann sem veitti þér umboð)',
      description: 'Commission person repeater field',
    },
    commissionsAddMoreDescription: {
      id: 'dpac.application:section.info.commissionsAddMoreDescription',
      defaultMessage: 'Eru fleiri umbjóðendur að baki kvörtunar?',
      description: 'Commission Add More Description',
    },
    commissionsAddMoreButtonLabel: {
      id: 'dpac.application:section.info.commissionsAddMoreButtonLabel',
      defaultMessage: 'Bæta við aðila',
      description: 'Commissions add more button label',
    },
    companyDisclaimer: {
      id: 'dpac.application:section.info.companyDisclaimer',
      defaultMessage:
        'Ekki er hægt að leggja inn kvörtun fyrir hönd fyrirtækis eða annars lögaðila',
      description:
        'Informs people that a complaint can not be registered on behalf of companies',
    },
    companyDisclaimerButtonLabel: {
      id: 'dpac.application:section.info.companyDisclaimerButtonLabel',
      defaultMessage: 'Nánari upplýsingar hér',
      description: 'Label of the more info button in the company disclaimer',
    },
  }),
}
