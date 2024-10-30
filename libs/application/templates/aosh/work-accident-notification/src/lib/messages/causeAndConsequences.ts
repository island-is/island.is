import { defineMessages } from 'react-intl'

export const causeAndConsequences = {
  shared: defineMessages({
    searchPlaceholder: {
      id: 'aosh.wan.application:causeAndConsequences.shared.searchPlaceholder',
      defaultMessage: 'Sláðu inn leitarorð',
      description: 'Placeholder of the search input',
    },
    mostSeriousWarning: {
      id: 'aosh.wan.application:causeAndConsequences.shared.mostSeriousWarning',
      defaultMessage: 'Hakaðu við það sem þú telur að sé alvarlegast.',
      description: 'Warning before "most serious" choice',
    },
    mostSeriousAlert: {
      id: 'aosh.wan.application:causeAndConsequences.shared.mostSeriousAlert',
      defaultMessage: 'Vinsamlegast veldur eitt af eftirfarandi.',
      description: 'Alert before "most serious" choice',
    },
    causeAndConsequencesNothingChosen: {
      id: 'aosh.wan.application:causeAndConsequences.shared.causeAndConsequencesNothingChosen',
      defaultMessage: 'Vinsamlegast veldu a.m.k einn valmöguleika',
      description:
        'error alerting users to choose at least on option (cause and consequences pages)',
    },
    selectPlaceholder: {
      id: 'aosh.wan.application:causeAndConsequences.shared.selectPlaceholder',
      defaultMessage: 'Vinsamlegast veldu a.m.k einn valmöguleika',
      description:
        'error alerting users to choose at least on option (cause and consequences pages)',
    },
  }),
  absence: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.absence.title',
      defaultMessage: 'Fjarvera vegna slyss',
      description: 'Title of the absence sub section',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.absence.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of the absence sub section',
    },
    alertMessageTitle: {
      id: 'aosh.wan.application:causeAndConsequences.absence.alertMessageTitle',
      defaultMessage: 'Fjarverudagar',
      description:
        'Title of the alert message field in the absence sub section',
    },
    alertMessage: {
      id: 'aosh.wan.application:causeAndConsequences.absence.alertMessage',
      defaultMessage:
        'Fjöldi almanaksdaga þar sem starfsmaðurinn er óvinnufær vegna vinnuslyss. Allir almanaksdagar telja óháð því hvort starfsmaður átti að vera í vinnu á þeim degi eða ekki.',
      description:
        'Message of the alert message field in the absence sub section',
    },
    absenceDueToAccident: {
      id: 'aosh.wan.application:causeAndConsequences.absence.absenceDueToAccident',
      defaultMessage: 'Fjarvera vegna slyssins',
      description: 'Label of select field, selecting absence due to accident',
    },
  }),
  circumstances: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.circumstances.title',
      defaultMessage: 'Aðstæður slyss',
      description: 'Title of the circumstance page',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.circumstances.description',
      defaultMessage:
        'Lýstu því við hvaða aðstæður slysið varð með því að velja úr listanum hér fyrir neðan. Þú getur líka slegið inn í leitina.',
      description: 'description of the circumstance page',
    },
    heading: {
      id: 'aosh.wan.application:causeAndConsequences.circumstances.heading',
      defaultMessage: 'Slysið varð við:',
      description: 'Heading before choosing circumstance of accident',
    },
    subHeading: {
      id: 'aosh.wan.application:causeAndConsequences.circumstances.subHeading',
      defaultMessage:
        'Lýstu því við hvaða aðstæður slysið varð með því að velja úr listanum hér fyrir neðan. Merktu við alla möguleika sem eiga við.',
      description:
        'Text below heading before choosing circumstance of accident',
    },
  }),
  deviations: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.deviations.title',
      defaultMessage: 'Frávik í vinnuferli',
      description: 'Title of the deviation page',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.deviations.description',
      defaultMessage:
        'Lýstu því við hvaða aðstæður slysið varð með því að velja úr listanum hér fyrir neðan. Þú getur líka slegið inn í leitina.',
      description: 'description of the deviation page',
    },
    heading: {
      id: 'aosh.wan.application:causeAndConsequences.deviations.heading',
      defaultMessage: 'Hvað fór úrskeiðis þegar slysið varð?',
      description: 'Heading before choosing deviation of accident',
    },
    subHeading: {
      id: 'aosh.wan.application:causeAndConsequences.deviations.subHeading',
      defaultMessage:
        'Lýstu því við hvað það var sem gerðist með því að velja úr listanum hér fyrir neðan. Merktu við alla möguleika sem eiga við.',
      description: 'Text below heading before choosing deviation of accident',
    },
  }),
  causeOfInjury: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.causeOfInjury.title',
      defaultMessage: 'Orsök áverka',
      description: 'Title of the cause of injury page',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.causeOfInjury.description',
      defaultMessage:
        'Lýstu því við hvaða aðstæður áverkinn myndaðist með því að velja úr listanum hér fyrir neðan. Þú getur líka slegið inn í leitina. Marktu við alla möguleika sem eiga við.',
      description: 'description of the cause of injury page',
    },
    heading: {
      id: 'aosh.wan.application:causeAndConsequences.causeOfInjury.heading',
      defaultMessage: '?ennan texta vantar...',
      description: 'Heading before choosing cause of injury of accident',
    },
    subHeading: {
      id: 'aosh.wan.application:causeAndConsequences.causeOfInjury.subHeading',
      defaultMessage: 'Lýstu því við hvað .... vantar þennan texta',
      description:
        'Text below heading before choosing cause of injury of accident',
    },
  }),
  typeOfInjury: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.typeOfInjury.title',
      defaultMessage: 'Tegund áverka',
      description: 'Title of the type of injury page',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.typeOfInjury.description',
      defaultMessage:
        'Lýstu hvers kyns áverki eða áverkar hlaust með því að velja úr listanum hér fyrir neðan. Þú getur líka slegið inn í leitina. Marktu við alla möguleika sem eiga við.',
      description: 'description of the type of injury page',
    },
    heading: {
      id: 'aosh.wan.application:causeAndConsequences.typeOfInjury.heading',
      defaultMessage: 'Þennan texta vantar...',
      description: 'Heading before choosing type of injury of accident',
    },
    subHeading: {
      id: 'aosh.wan.application:causeAndConsequences.typeOfInjury.subHeading',
      defaultMessage: 'Lýstu því við hvað .... vantar þennan texta',
      description:
        'Text below heading before choosing type of injury of accident',
    },
  }),
  injuredBodyParts: defineMessages({
    title: {
      id: 'aosh.wan.application:causeAndConsequences.injuredBodyParts.title',
      defaultMessage: 'Skaddaðir líkamshlutar',
      description: 'Title of the injured body parts page',
    },
    description: {
      id: 'aosh.wan.application:causeAndConsequences.injuredBodyParts.description',
      defaultMessage:
        'Lýstu hvers kyns áverki eða áverkar hlaust með því að velja úr listanum hér fyrir neðan. Þú getur líka slegið inn í leitina. Marktu við alla möguleika sem eiga við.',
      description: 'description of the injured body parts page',
    },
    heading: {
      id: 'aosh.wan.application:causeAndConsequences.injuredBodyParts.heading',
      defaultMessage: 'Þennan texta vantar...',
      description: 'Heading before choosing injured body parts of accident',
    },
    subHeading: {
      id: 'aosh.wan.application:causeAndConsequences.injuredBodyParts.subHeading',
      defaultMessage: 'Lýstu því hvað .... vantar þennan texta',
      description:
        'Text below heading before choosing injured body parts of accident',
    },
  }),
}
