import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.cs.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information section title',
    },
  }),
  labels: {
    formerIcelander: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.formerIcelander.subSectionTitle',
        defaultMessage: 'Fyrrum ísl. ríkisborgari',
        description: 'formerIcelander sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.formerIcelander.pageTitle',
        defaultMessage: 'Fyrrum íslenskur ríkisborgari',
        description: 'formerIcelander title',
      },
      description: {
        id: 'doi.cs.application:information.labels.formerIcelander.description',
        defaultMessage:
          'Ertu fyrrum íslenskur ríkisborgari og hefur átt lögheimili á Íslandi í 1 ár? (Þú hefur missti íslenskt ríkisfang vegna umsóknar og veitingar erlends ríkisfangs)',
        description: 'formerIcelander description',
      },
      alertTitle: {
        id: 'doi.cs.application:information.labels.formerIcelander.alertTitle',
        defaultMessage: 'Þú uppfyllir engin búsetuskilyrði',
        description: 'formerIcelander alert title',
      },
      alertDescription: {
        id: 'doi.cs.application:information.labels.formerIcelander.alertDescription',
        defaultMessage:
          'Þú uppfyllir engin búsetuskliyrði, vinsamlegast hafðu samband við Útlendingastofnun ef þú telur þig hafa rétt á því.',
        description: 'formerIcelander alert description',
      },
      alertLinkTitle: {
        id: 'doi.cs.application:information.labels.formerIcelander.alertLinkTitle',
        defaultMessage: 'Sjá nánar um búsetuskilyrði hér.',
        description: 'formerIcelander alert link title',
      },
      alertLinkUrl: {
        id: 'doi.cs.application:information.labels.formerIcelander.alertLinkUrl',
        defaultMessage: '/',
        description: 'formerIcelander alert link url',
      },
    }),
    parents: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.parents.subSectionTitle',
        defaultMessage: 'Foreldrar',
        description: 'Parents sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.parents.pageTitle',
        defaultMessage: 'Foreldrar með íslenskt ríkisfang',
        description: 'Parents page title',
      },
      parentTitle: {
        id: 'doi.cs.application:information.labels.parents.parentTitle#markdown',
        defaultMessage: '**Foreldri {index}**',
        description: 'Parent title',
      },
    }),
    maritalStatus: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.maritalStatus.subSectionTitle',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.maritalStatus.pageTitle',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status page title',
      },
      titleStatus: {
        id: 'doi.cs.application:information.labels.maritalStatus.titleStatus',
        defaultMessage: 'Hjúskaparstaða þín',
        description: 'Marital status title status',
      },
      titleSpouse: {
        id: 'doi.cs.application:information.labels.maritalStatus.titleSpouse',
        defaultMessage: 'Maki þinn',
        description: 'Marital status title spouse',
      },
      marritalStatusDate: {
        id: 'doi.cs.application:information.labels.maritalStatus.marritalStatusDate',
        defaultMessage: 'Dagsetning hjúskapar',
        description: 'Marital status change date spouse',
      },
      status: {
        id: 'doi.cs.application:information.labels.maritalStatus.status',
        defaultMessage: 'Hjúskaparstaða',
        description: 'Marital status label',
      },
      nationalId: {
        id: 'doi.cs.application:information.labels.maritalStatus.nationalId',
        defaultMessage: 'Kennitala maka',
        description: 'Marital status national ID label',
      },
      name: {
        id: 'doi.cs.application:information.labels.maritalStatus.name',
        defaultMessage: 'Nafn maka',
        description: 'Marital status name label',
      },
      spouseBirthCountry: {
        id: 'doi.cs.application:information.labels.maritalStatus.spouseBirthCountry',
        defaultMessage: 'Fæðingarland maka',
        description: 'Spouse birth country label',
      },
      spouseCitizenship: {
        id: 'doi.cs.application:information.labels.maritalStatus.spouseCitizenship',
        defaultMessage: 'Ríkisfang maka',
        description: 'Spouse citizenship label',
      },
      applicantAddress: {
        id: 'doi.cs.application:information.labels.maritalStatus.applicantAddress',
        defaultMessage: 'Heimilisfang þitt',
        description: 'Applicant address label',
      },
      spouseAddress: {
        id: 'doi.cs.application:information.labels.maritalStatus.spouseAddress',
        defaultMessage: 'Heimilisfang maka',
        description: 'Applicant spouse address label',
      },
      explanationTitle: {
        id: 'doi.cs.application:information.labels.maritalStatus.explanationTitle',
        defaultMessage:
          'Heimilisfang þitt og maka þíns er ekki sameiginlegt, vinsamlegast tilgreinið ástæðu þess.',
        description: 'Title of explanation field',
      },
      explanation: {
        id: 'doi.cs.application:information.labels.maritalStatus.explanation',
        defaultMessage: 'Skýring',
        description: 'Explanation label',
      },
    }),
    countriesOfResidence: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.subSectionTitle',
        defaultMessage: 'Búsetulönd',
        description: 'Countries of residence sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.pageTitle',
        defaultMessage: 'Búsetulönd',
        description: 'Countries of residence page title',
      },
      questionTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.questionTitle',
        defaultMessage:
          '**Hefur þú búið í öðru landi en Íslandi eftir 15 ára aldur?**',
        description: 'Countries of residence question title',
      },
      countryListTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.countryListTitle',
        defaultMessage: 'Vinsamlegast tilgreindu þau lönd sem við á',
        description: 'Countries of residence list countries title',
      },
      buttonTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.buttonTitle',
        defaultMessage: 'Bæta við fleiri löndum',
        description: 'Add more countries button title',
      },
      deleteButtonTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.deleteButtonTitle',
        defaultMessage: 'Eyða færslu',
        description: 'Add more countries button title',
      },
      splitterTitle: {
        id: 'doi.cs.application:information.labels.countriesOfResidence.splitterTitle',
        defaultMessage: 'Búsetuland',
        description: 'Item splitter title',
      },
    }),
    staysAbroad: defineMessages({
      subSectionTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.subSectionTitle',
        defaultMessage: 'Dvöl erlendis',
        description: 'Stays abroad sub section title',
      },
      pageSubTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.pageSubTitle',
        defaultMessage:
          'Gefðu upplýsingar um dvöl erlendis lengur en 3 mánuði frá lögheimilisskráningu, til þess dags þegar þessi umsókn er lögð fram.',
        description: 'Stays abroad sub section title',
      },
      pageTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.pageTitle',
        defaultMessage: 'Dvöl erlendis á tímabilinu',
        description: 'Stays abroad page title',
      },
      itemTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.itemTitle#markdown',
        defaultMessage: '**Dvalarland {index}**',
        description: 'Stay abroad item separator title',
      },
      questionTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.questionTitle',
        defaultMessage:
          '**Hefur þú frá lögheimilsskráningu dvalið utan Íslands lengur en 3 mánuði?**',
        description: 'Stays abroad title',
      },
      selectLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.selectLabel',
        defaultMessage: 'Land sem þú dvaldir í síðast',
        description: 'Country select label',
      },
      dateFromLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.dateFromLabel',
        defaultMessage: 'Dagsetning frá',
        description: 'From date label',
      },
      dateToLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.dateToLabel',
        defaultMessage: 'Dagsetning til',
        description: 'To date label',
      },
      purposeLabel: {
        id: 'doi.cs.application:information.labels.staysAbroad.purposeLabel',
        defaultMessage: 'Tilgangur dvalar',
        description: 'purpose of stay label',
      },
      buttonTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.buttonTitle',
        defaultMessage: 'Bæta við fleiri dvalarupplýsingum',
        description: 'Add more countries button title',
      },
      deleteButtonTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.deleteButtonTitle',
        defaultMessage: 'Eyða færslu',
        description: 'Add more countries button title',
      },
      dateRangeError: {
        id: 'doi.cs.application:information.labels.staysAbroad.dateRangeError',
        defaultMessage: 'Dvalartími þarf að vera lengur en 3 mánuðir',
        description: 'Validation error for 3 month date range',
      },
      splitterTitle: {
        id: 'doi.cs.application:information.labels.staysAbroad.splitterTitle',
        defaultMessage: 'Dvalarland',
        description: 'Item splitter title',
      },
    }),
    radioButtons: defineMessages({
      radioOptionYes: {
        id: 'doi.cs.application:information.labels.radioButtons.radioYes',
        defaultMessage: 'Já',
        description: 'Yes option on radio button',
      },
      radioOptionNo: {
        id: 'doi.cs.application:information.labels.radioButtons.radioNo',
        defaultMessage: 'Nei',
        description: 'No option on radio button',
      },
    }),
  },
}
