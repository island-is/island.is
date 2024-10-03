import { defineMessages } from 'react-intl'

export const idInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:idInformation.general.sectionTitle',
      defaultMessage: 'Nafnskírteini',
      description: 'Id Information section title',
    },
    typeofIdSectionTitle: {
      id: 'id.application:idInformation.general.typeofIdSectionTitle',
      defaultMessage: 'Tegund',
      description: 'type of id section title',
    },
    chosenApplicantsSectionTitle: {
      id: 'id.application:idInformation.general.chosenApplicantsSectionTitle',
      defaultMessage: 'Umsækjendur',
      description: 'chosen applicants section title',
    },
    conditionSectionTitle: {
      id: 'id.application:idInformation.general.conditionSectionTitle',
      defaultMessage: 'Áður en lengra er haldið',
      description: 'condition section title',
    },
  }),
  labels: defineMessages({
    typeOfIdTitle: {
      id: 'id.application:idInformation.labels.typeOfIdTitle',
      defaultMessage: 'Nafnskírteini',
      description: 'Type of id page title',
    },
    typeOfIdDescription: {
      id: 'id.application:idInformation.labels.typeOfIdDescription',
      defaultMessage:
        'Gefnar eru út tvær tegundir nafnskírteina: Nafnskírteini sem gildir sem ferðaskilríki innan EES og nafnskírteini sem ekki er ferðaskilríki.  Báðar tegundir gilda sem fullgilt persónuskilríki og báðar tegundir eru með örgjörva sem geymir lífkenni handhafa.  Nánari upplýsingar um muninn á þessum tegundum, og hvar ferðaskilríkin eru tekin gild, er að finna á: [https://www.skra.is/folk/vegabref-og-onnur-skilriki/nafnskirteini/tegundir-nafnskirteina/](https://www.skra.is/folk/vegabref-og-onnur-skilriki/nafnskirteini/tegundir-nafnskirteina/)',
      description: 'Type of id page description',
    },
    typeOfIdRadioLabel: {
      id: 'id.application:idInformation.labels.typeOfIdRadioLabel',
      defaultMessage: 'Veldu hvaða tegund nafnskírteinis þú vilt sækja um',
      description: 'Type of id radio label',
    },
    typeOfIdRadioAnswerOne: {
      id: 'id.application:idInformation.labels.typeOfIdRadioAnswerOne',
      defaultMessage: 'Nafnskírteini ekki sem ferðaskilríki',
      description: 'Type of id radio answer id card without travel rights',
    },
    typeOfIdRadioAnswerTwo: {
      id: 'id.application:idInformation.labels.typeOfIdRadioAnswerTwo',
      defaultMessage: 'Nafnskírteini sem ferðaskilríki',
      description: 'Type of id radio answer id card travel rights',
    },
    warningText: {
      id: 'id.application:idInformation.labels.warningText',
      defaultMessage:
        'Þú uppfyllir ekki skilyrði fyrir báðum útgáfum af nafnskírteini',
      description: 'Warning alert for type of ID',
    },
    infoAlert: {
      id: 'id.application:idInformation.labels.infoAlert',
      defaultMessage:
        'Athugaðu að sama gjald er tekið fyrir báðar þessar tegundir',
      description: 'Information alert for type of ID',
    },
    chosenApplicantsDescription: {
      id: 'id.application:idInformation.labels.chosenApplicantsDescription#markdown',
      defaultMessage:
        'Þú getur sótt um nafnskírteini / ferðaskilríki fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
      description: 'description of chosen applicants page',
    },
    idNumber: {
      id: 'id.application:idInformation.labels.idNumber',
      defaultMessage:
        'Nafnskírteinisnúmer {passportNumber} - Rennur út {expirationDate}',
      description: 'Id number label',
    },
    noIdNumber: {
      id: 'id.application:idInformation.labels.noIdNumber',
      defaultMessage: 'Ekkert nafnskírteini fannst',
      description: 'Id number not found label',
    },
    conditionTitle: {
      id: 'id.application:idInformation.labels.conditionTitle',
      defaultMessage: 'Áður en lengra er haldið',
      description: 'Title of condition page',
    },
    conditionDescription: {
      id: 'id.application:idInformation.labels.conditionDescription#markdown',
      defaultMessage: `Þegar sótt er um fyrir barn þurfa báðir forsjáraðilar að samþykkja umsóknina. Þegar þú hefur klárað umsóknina mun {parentBName} fá tilkynningu um að samþykkja þurfi þessa umsókn inni á island.is með rafrænum skilríkjum. {parentBName} hefur 7 daga til að ganga frá samþykkinu og það verður síðan vistað rafrænt hjá Þjóðskrá Íslands. Ef rafræn skilríki eru ekki fyrir hendi er ekki hægt að klára forskráningu hér og sækja verður um á umsóknarstað.`,
      description: 'Description on condition page',
    },
  }),
}
