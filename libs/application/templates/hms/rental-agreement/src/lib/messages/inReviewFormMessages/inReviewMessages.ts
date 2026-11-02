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
  assigneeInfo: defineMessages({
    sectionName: {
      id: 'ra.application:inReview.assigneeInfo.sectionName',
      defaultMessage: 'Yfirlestur',
      description: 'Name of the review section shown to other parties',
    },
    pageTitle: {
      id: 'ra.application:inReview.assigneeInfo.pageTitle',
      defaultMessage: 'Samningsdrög til yfirlestrar',
      description: 'Title of the review page shown to other parties',
    },
    pageDescription: {
      id: 'ra.application:inReview.assigneeInfo.pageDescription',
      defaultMessage:
        'Hér getur þú lesið yfir drög að leigusamningi sem þú ert aðili að. Aðeins sá aðili sem hóf samningsgerðina getur gert breytingar á samningnum og sent hann í rafræna undirritun.',
      description: 'Description of the review page shown to other parties',
    },
    infoHeading: {
      id: 'ra.application:inReview.assigneeInfo.infoHeading',
      defaultMessage: 'Næsta skref',
      description: 'Heading for the next steps info shown to other parties',
    },
    infoBullets: {
      id: 'ra.application:inReview.assigneeInfo.infoBullets#markdown',
      defaultMessage:
        '- Ef þú hefur athugasemdir við samningsdrögin skaltu hafa samband við gagnaðila samningsins (leigusala eða leigutaka eftir því hver hóf samningsgerðina). \n- Ef þú hefur engar athugasemdir skaltu biðja þann aðila um að senda samninginn í rafræna undirritun. \n- Þegar samningurinn hefur verið sendur í undirritun færð þú SMS og tölvupóst frá HMS með beiðni um rafræna undirritun.',
      description: 'Bullets for the next steps info shown to other parties',
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

    // dataSchema errors
    statementError: {
      id: 'ra.application:inReview.preSignatureInfo.statementError',
      defaultMessage:
        'Þú þarft að samþykkja skilyrði undirritunar til að halda áfram',
      description: 'Error message when statement is not checked',
    },
  }),
}
