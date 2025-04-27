import { defineMessages } from 'react-intl'

export const inReview = {
  reviewInfo: defineMessages({
    sectionName: {
      id: 'ra.application:inReview.reviewInfo.sectionName',
      defaultMessage: 'Yfirlestur',
      description: 'Name of the signature review section',
    },
    pageDescription: {
      id: 'ra.application:inReview.reviewInfo.reviewPageDescription',
      defaultMessage:
        'Búið er að senda samantektina með tölvupósti á aðila samnings til yfirlestrar.',
      description: 'Description of the review page',
    },
    tableTitle: {
      id: 'ra.application:inReview.reviewInfo.tableTitle',
      defaultMessage: 'Aðilar samnings',
      description: 'Title for the review table',
    },
    infoHeading: {
      id: 'ra.application:inReview.reviewInfo.pageInfoHeading',
      defaultMessage: 'Næsta skref',
      description: 'Heading for the review page info',
    },
    infoBullets: {
      id: 'ra.application:inReview.reviewInfo.pageInfoBullets#markdown',
      defaultMessage:
        '- Ef þú þarft að gera breytingar út frá athugasemdum samningsaðila getur þú farið til baka til að gera þær. \n- Ef samningsaðilar hafa engar athugasemdir er þér óhætt að halda áfram í undirritun.',
      description: 'Bullets for the review page info',
    },
    nextStepToEditButtonText: {
      id: 'ra.application:inReview.reviewInfo.nextStepToEditButtonText',
      defaultMessage:
        'Ég vil fara til baka til að gera breytingar á samningnum',
      description: 'Text on the edit button',
    },
    nextStepToSigningButtonText: {
      id: 'ra.application:inReview.reviewInfo.nextStepToSigningButtonText',
      defaultMessage: 'Ég vil halda áfram í undirritun',
      description: 'Text on the go to signing button',
    },
  }),
  preSignatureInfo: defineMessages({
    sectionName: {
      id: 'ra.application:inReview.preSignatureInfo.sectionName',
      defaultMessage: 'Undirritun',
      description: 'Name of the signature section',
    },
    pageDescription: {
      id: 'ra.application:inReview.preSignatureInfo.pageDescription',
      defaultMessage:
        'Þegar samningur er sendur í undirritun fá aðilar samnings SMS og tölvupóst frá HMS með beiðni um rafræna undirritun. Þegar allir aðilar hafa undirritað er samningurinn fullkláraður og skráist sjálfkrafa í leiguskrá HMS.',
      description: 'Description of the signature page',
    },
    infoHeading: {
      id: 'ra.application:inReview.preSignatureInfo.pageInfoHeading',
      defaultMessage: 'Gott að vita',
      description: 'Heading for the signature page info',
    },
    infoBullets: {
      id: 'ra.application:inReview.preSignatureInfo.pageInfoBullets#markdown',
      defaultMessage:
        '- Ekki er hægt að gera breytingar á samningi eftir að búið er að senda í undirritun \n- Ef nauðsynlegt þykir að gera breytingu þarf að útbúa nýjan samning \n- Samningur tekur ekki gildi fyrr en allir aðilar samnings hafa undirritað',
      description: 'Bullets for the signature page info',
    },
    tableTitle: {
      id: 'ra.application:inReview.preSignatureInfo.tableTitle',
      defaultMessage: 'Aðilar sem undirrita',
      description: 'Title for the signature table',
    },
    tableHeaderName: {
      id: 'ra.application:inReview.preSignatureInfo.tableHeaderName',
      defaultMessage: 'Fullt nafn',
      description: 'Header for the name column in signature table',
    },
    tableHeaderId: {
      id: 'ra.application:inReview.preSignatureInfo.tableHeaderId',
      defaultMessage: 'Kennitala',
      description: 'Header for the ID column in signature table',
    },
    tableHeaderPhone: {
      id: 'ra.application:inReview.preSignatureInfo.tableHeaderPhone',
      defaultMessage: 'Símanúmer',
      description: 'Header for the phone column in signature table',
    },
    tableHeaderEmail: {
      id: 'ra.application:inReview.preSignatureInfo.tableHeaderEmail',
      defaultMessage: 'Netfang',
      description: 'Header for the email column in signature table',
    },
    statementLabel: {
      id: 'ra.application:inReview.preSignatureInfo.statementLabel',
      defaultMessage:
        'Ég skil að ekki er hægt að gera breytingar á samningi eftir að búið er að senda í undirritun.',
      description: 'Label for the statement checkbox',
    },
    submitButtonText: {
      id: 'ra.application:inReview.preSignatureInfo.submitButtonText',
      defaultMessage: 'Senda í undirritun',
      description: 'Text on the page submit button',
    },
    editButtonText: {
      id: 'ra.application:inReview.preSignatureInfo.editButtonText',
      defaultMessage: 'Til baka í yfirlit',
      description: 'Text on the page edit button',
    },

    // dataSchema errors
    statementError: {
      id: 'ra.application:inReview.preSignatureInfo.statementError',
      defaultMessage:
        'Þú þarft að samþykkja skilyrði undirritunar til að halda áfram',
      description: 'Error message when statement is not checked',
    },
  }),
}
