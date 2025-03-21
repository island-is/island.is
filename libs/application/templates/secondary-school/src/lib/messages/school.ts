import { defineMessages } from 'react-intl'

export const school = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:school.general.sectionTitle',
      defaultMessage: 'Val á skóla',
      description: 'Title of school selection section',
    },
    pageTitle: {
      id: 'ss.application:school.general.pageTitle',
      defaultMessage: 'Val á skóla',
      description: 'Title of school selection page',
    },
    description: {
      id: 'ss.application:school.general.description',
      defaultMessage:
        'Vinsamlegast veldu hvaða skóla og námsleið þú vilt sækja um.',
      description: 'Description of school selection page',
    },
  }),
  selection: defineMessages({
    schoolLabel: {
      id: 'ss.application:school.selection.schoolLabel',
      defaultMessage: 'Skóli',
      description: 'School select label',
    },
    firstProgramLabel: {
      id: 'ss.application:school.selection.firstProgramLabel',
      defaultMessage: 'Braut',
      description: 'First program select label',
    },
    secondProgramLabel: {
      id: 'ss.application:school.selection.secondProgramLabel',
      defaultMessage: 'Braut til vara',
      description: 'Second program select label',
    },
    thirdLanguageLabel: {
      id: 'ss.application:school.selection.thirdLanguageLabel',
      defaultMessage: 'Þriðja tungumál ef við á',
      description: 'Third language select label',
    },
    nordicLanguageLabel: {
      id: 'ss.application:school.selection.nordicLanguageLabel',
      defaultMessage:
        'Norðurlandamál (ef þú ert með bakgrunn í öðru en dönsku)',
      description: 'Nordic language select label',
    },
    requestDormitoryCheckboxLabel: {
      id: 'ss.application:school.selection.requestDormitoryCheckboxLabel',
      defaultMessage: 'Ég óska eftir heimavist',
      description: 'Request dormitory checkbox label',
    },
    addButtonLabel: {
      id: 'ss.application:school.selection.addButtonLabel',
      defaultMessage: 'Bæta við vali á skóla',
      description: 'Selection add button label',
    },
    removeButtonLabel: {
      id: 'ss.application:school.selection.removeButtonLabel',
      defaultMessage: 'Fjarlægja vali á skóla',
      description: 'Selection remove button label',
    },
    specialNeedsProgramAlertTitle: {
      id: 'ss.application:school.selection.specialNeedsProgramAlertTitle',
      defaultMessage: 'Athugið',
      description: 'If selected special needs program alert title',
    },
    specialNeedsProgramAlertDescription: {
      id: 'ss.application:school.selection.specialNeedsProgramAlertDescription',
      defaultMessage:
        'Þú hefur valið {programNameList}. Starfsbrautir eru ætlaðar nemendum sem hafa stundað nám í sérdeildum grunnskóla eða notið mikillar sérkennslu á grunnskólastigi.',
      description: 'If selected (single) special needs program alert message',
    },
  }),
  firstSelection: defineMessages({
    subtitle: {
      id: 'ss.application:school.firstSelection.subtitle',
      defaultMessage: 'Fyrsta val',
      description: 'First selection sub title',
    },
  }),
  secondSelection: defineMessages({
    subtitle: {
      id: 'ss.application:school.secondSelection.subtitle',
      defaultMessage: 'Annað val',
      description: 'Second selection sub title',
    },
  }),
  thirdSelection: defineMessages({
    subtitle: {
      id: 'ss.application:school.thirdSelection.subtitle',
      defaultMessage: 'Þriðja val',
      description: 'Third selection sub title',
    },
    addAlertTitle: {
      id: 'ss.application:school.thirdSelection.addAlertTitle',
      defaultMessage: 'Viltu bæta við öðrum skóla?',
      description: 'Add third selection alert title',
    },
    addAlertDescription: {
      id: 'ss.application:school.thirdSelection.addAlertDescription',
      defaultMessage:
        'Ákveðnir framhaldsskólar á Íslandi fá jafnan fleiri umsóknir en pláss leyfa. Til að auka líkur á að komast inn í skóla að þínu vali getur þú bætt inn þriðja skólanum. Mikilvægt er að kynna sér inntökuskilyrði hvers skóla vandlega. Fáir þú ekki inni í einhverjum þeirra skóla sem þú sækir um mun Miðstöð menntunar og skólaþjónustu útvega þér skólapláss.',
      description: 'Add third selection alert description',
    },
  }),
}
