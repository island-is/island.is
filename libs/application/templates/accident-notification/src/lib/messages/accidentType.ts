import { defineMessages } from 'react-intl'

export const accidentType = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:accidentType.sectionTitle',
      defaultMessage: 'Upplýsingar um slys',
      description: 'Accident circumstances',
    },
    heading: {
      id: 'an.application:accidentType.heading',
      defaultMessage: 'Við hvaða aðstæður varð slysið?',
      description: 'Under what circumstances did the accident occur?',
    },
    description: {
      id: 'an.application:accidentType.description',
      defaultMessage: `Vinsamlegast veldu þann slysaflokk sem lýsir best aðstæðum slyssins.  Slysið sem um ræðir varð við:`,
      description:
        'Please select the category of accident that best describes the situation of the accident.',
    },
    subsectionTitle: {
      id: 'an.application:accidentType.subsectionTitle',
      defaultMessage: `Aðstæður slyss`,
      description: 'AccidentType subsection title.',
    },
  }),
  labels: defineMessages({
    homeActivities: {
      id: 'an.application:accidentType.labels.homeActivities',
      defaultMessage: 'Heimilisstörf',
      description: 'Home activites',
    },
    work: {
      id: 'an.application:accidentType.labels.work',
      defaultMessage: 'Vinnu',
      description: 'Work',
    },
    rescueWork: {
      id: 'an.application:accidentType.labels.rescueWork',
      defaultMessage: 'Björgunarstörf',
      description: 'Rescue Work',
    },
    studies: {
      id: 'an.application:accidentType.labels.studies',
      defaultMessage: 'Nám',
      description: 'Studies',
    },
    sports: {
      id: 'an.application:accidentType.labels.sport',
      defaultMessage: 'Íþróttaiðkun',
      description: 'Sport activites',
    },
  }),
  workAccidentType: defineMessages({
    generalWorkAccident: {
      id: 'an.application:accidentType.workAccidentType.generalWorkAccident',
      defaultMessage: 'Almennt vinnuslys á landi',
      description: 'General work accident',
    },
    fishermanAccident: {
      id: 'an.application:accidentType.workAccidentType.fishermanAccident',
      defaultMessage: 'Vinnuslys sjómanna',
      description: 'Fisherman accident',
    },
    professionalAthlete: {
      id: 'an.application:accidentType.workAccidentType.professionalAthlete',
      defaultMessage: 'Atvinnumennska í íþróttum',
      description: 'Professional athlete accident',
    },
    agricultureAccident: {
      id: 'an.application:accidentType.workAccidentType.agricultureAccident',
      defaultMessage: 'Slys við landbúnað',
      description: 'Agriculture Accident',
    },
    heading: {
      id: 'an.application:accidentType.workAccidentType.heading',
      defaultMessage: 'Vinnuslys',
      description: 'Work accident type heading',
    },
    description: {
      id: 'an.application:accidentType.workAccidentType.description',
      defaultMessage: `Allir launþegar án tillits til aldurs, sem starfa hér á landi eru slysatryggðir ef laun eru greidd hér á landi. Vinsamlegast veldu þann flokk sem lýsir best aðstæðum sem um ræðir varðar við:`,
      description: 'Work accident type description',
    },
    subSectionTitle: {
      id: 'an.application:accidentType.workAccidentType.subsection',
      defaultMessage: 'Vinnuslys',
      description: 'Title for the work accident type subsection',
    },
  }),
  studiesAccidentType: defineMessages({
    heading: {
      id: 'an.application:accidentType.studiesAccidentType.heading',
      defaultMessage: 'Í hverskonar námi tengist slysið?',
      description: 'Studies accident type heading',
    },
    description: {
      id: 'an.application:accidentType.studiesAccidentType.description',
      defaultMessage: `Allir nemendur í iðnnámi í löggiltum iðngreinum og nemar í starfsnámi sem stunda nám 
      í heilbrigðisgreinum og raunvísindum og háskólanemar þegar þeir 
      sinna verklegu námi eru slysatryggðir hjá Sjúkratryggingum Íslands.`,
      description: 'Studies accident type description',
    },
    subSectionTitle: {
      id: 'an.application:accidentType.studiesAccidentType.subsection',
      defaultMessage: 'Slys við nám ',
      description: 'Title for the studies accident type subsection',
    },
    apprenticeship: {
      id: 'an.application:accidentType.studiesAccidentType.appprenticeship',
      defaultMessage: 'Verknámi í háskóla',
      description: 'Label for the apprenticeship studies accident',
    },
    internship: {
      id: 'an.application:accidentType.studiesAccidentType.internship',
      defaultMessage: 'Starfsnám',
      description: 'Label for the internship studies accident',
    },
    vocationalEducation: {
      id: 'an.application:accidentType.studiesAccidentType.vocationalEducation',
      defaultMessage: 'Iðnnám í löggildum iðngreinum',
      description: 'Label for the internship studies accident',
    },
  }),
  warning: defineMessages({
    agricultureAccidentWarning: {
      id: 'an.application:accidentType.warning.agricultureAccidentWarning',
      defaultMessage:
        'Slys við landbúnað á einungis við um bændur, maka þeirra og börn. Annars á almennt vinnuslys á landi við.',
      description:
        'Agricultural accidents only apply to farmers, their spouses and children. Otherwise, a general work accident on land applies.',
    },
  }),
}
