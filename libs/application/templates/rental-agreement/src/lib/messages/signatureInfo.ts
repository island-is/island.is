import { defineMessages } from 'react-intl'

export const signatureInfo = defineMessages({
  sectionName: {
    id: 'ra.application:signture.sectionName',
    defaultMessage: 'Undirritun',
    description: 'Name of the signature section',
  },
  pageDescription: {
    id: 'ra.application:signture.pageDescription',
    defaultMessage:
      'Þegar samningur er sendur í undirritun fá aðilar samnings SMS og tölvupóst frá HMS með beiðni um rafræna undirritun. Þegar allir aðilar hafa undirritað er samningurinn fullkláraður og skráist sjálfkrafa í leiguskrá HMS.',
    description: 'Description of the signature page',
  },
  infoHeading: {
    id: 'ra.application:signture.pageInfoHeading',
    defaultMessage: 'Gott að vita',
    description: 'Heading for the signature page info',
  },
  infoBullets: {
    id: 'ra.application:signture.pageInfoBullets#markdown',
    defaultMessage:
      '- Ekki er hægt að gera breytingar á samningi eftir að búið er að senda í undirritun \n- Ef nauðsynlegt þykir að gera breytingu þarf að útbúa nýjan samning \n- Samningur tekur ekki gildi fyrr en allir aðilar samnings hafa undirritað',
    description: 'Bullets for the signature page info',
  },
  tableTitle: {
    id: 'ra.application:signture.tableTitle',
    defaultMessage: 'Aðilar sem undirrita',
    description: 'Title for the signature table',
  },
  tableHeaderName: {
    id: 'ra.application:signture.tableHeaderName',
    defaultMessage: 'Fullt nafn',
    description: 'Header for the name column in signature table',
  },
  tableHeaderId: {
    id: 'ra.application:signture.tableHeaderId',
    defaultMessage: 'Kennitala',
    description: 'Header for the ID column in signature table',
  },
  tableHeaderPhone: {
    id: 'ra.application:signture.tableHeaderPhone',
    defaultMessage: 'Símanúmer',
    description: 'Header for the phone column in signature table',
  },
  tableHeaderEmail: {
    id: 'ra.application:signture.tableHeaderEmail',
    defaultMessage: 'Netfang',
    description: 'Header for the email column in signature table',
  },
  statementLabel: {
    id: 'ra.application:signture.statementLabel',
    defaultMessage:
      'Ég skil að ekki er hægt að gera breytingar á samningi eftir að búið er að senda í undirritun.',
    description: 'Label for the statement checkbox',
  },
  submitButtonText: {
    id: 'ra.application:signture.submitButtonText',
    defaultMessage: 'Senda í undirritun',
    description: 'Text on the page submit button',
  },

  // dataSchema errors
  statementError: {
    id: 'ra.application:signture.statementError',
    defaultMessage:
      'Þú þarft að samþykkja skilyrði undirritunar til að halda áfram',
    description: 'Error message when statement is not checked',
  },
})
