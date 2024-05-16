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
      defaultMessage: 'Tegund nafnskírteinis',
      description: 'Type of id page title',
    },
    typeOfIdDescription: {
      id: 'id.application:idInformation.labels.typeOfIdDescription',
      defaultMessage:
        'Eget ultricies diam massa aliquet in lobortis. Nulla mi eget amet nisl laoreet aliquam vel enim. Viverra luctus quis ut at sit nunc. Eget risus vel vehicula fusce sed adipiscing donec semper. Sollicitudin adipiscing id.',
      description: 'Type of id page description',
    },
    typeOfIdRadioLabel: {
      id: 'id.application:idInformation.labels.typeOfIdRadioLabel',
      defaultMessage: 'Veldu hvaða tegund nafnskírteinis þú vilt sækja um',
      description: 'Type of id radio label',
    },
    typeOfIdRadioAnswerOne: {
      id: 'id.application:idInformation.labels.typeOfIdRadioAnswerOne',
      defaultMessage: 'Nafnskírteini sem ferðaskilríki',
      description: 'Type of id radio answer id card with travel rights',
    },
    typeOfIdRadioAnswerTwo: {
      id: 'id.application:idInformation.labels.typeOfIdRadioAnswerTwo',
      defaultMessage: 'Nafnskírteini',
      description: 'Type of id radio answer id card without travel rights',
    },
    chosenApplicantsDescription: {
      id: 'id.application:idInformation.labels.chosenApplicantsDescription',
      defaultMessage:
        'Þú getur sótt um nafnskírteini / ferðaskilríki fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
      description: 'description of chosen applicants page',
    },
    idNumber: {
      id: 'id.application:idInformation.labels.idNumber',
      defaultMessage: 'Nafnskírteinisnúmer {passportNumber}',
      description: 'Id number label',
    },
    conditionTitle: {
      id: 'id.application:idInformation.labels.conditionTitle',
      defaultMessage: 'Áður en lengra er haldið',
      description: 'Title of condition page',
    },
    conditionDescription: {
      id: 'id.application:idInformation.labels.conditionDescription#markdown',
      defaultMessage:
        'Þegar sótt er um fyrir barn þarf forsjáraðili 2 að samþykkja umsóknina innan 7 daga. Viðkomandi fær tilkynningu um undirritun og getur samþykkt með rafrænum hætti. Samþykkið er vistað rafrænt hjá Þjóðskrá Íslands.Séu rafræn skilríki ekki fyrir hendi er hægt að skila inn skriflegu samþykki til Sýslumanns/Þjóðskrár.',
      description: 'Description on condition page',
    },
  }),
}
