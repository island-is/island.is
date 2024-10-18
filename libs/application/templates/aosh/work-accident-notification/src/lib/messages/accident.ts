import { defineMessages } from 'react-intl'

export const accident = {
  about: defineMessages({
    pageTitle: {
      id: 'aosh.wan.application:accident.about.pageTitle',
      defaultMessage: 'Um Slysið',
      description: 'Title of accident page',
    },
    description: {
      id: 'aosh.wan.application:accident.about.description',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: 'Description of accident page',
    },
    informationHeading: {
      id: 'aosh.wan.application:accident.about.informationHeading',
      defaultMessage: 'Upplýsingar um slysið',
      description: 'First heading of the accident page',
    },
    date: {
      id: 'aosh.wan.application:accident.about.date',
      defaultMessage: 'Dagsetning slyss',
      description: 'Label of date input field',
    },
    time: {
      id: 'aosh.wan.application:accident.about.time',
      defaultMessage: 'Tímasetning slyss',
      description: 'Label of time input field',
    },
    timePlaceholder: {
      id: 'aosh.wan.application:accident.about.timePlaceholder',
      defaultMessage: '23:59',
      description: 'placeholder of time input field',
    },
    didAoshCome: {
      id: 'aosh.wan.application:accident.about.didAoshCome',
      defaultMessage: 'Kom vinnueftirlitið?',
      description: 'Label of did Aosh arrive on scene input field',
    },
    didPoliceCome: {
      id: 'aosh.wan.application:accident.about.didPoliceCome',
      defaultMessage: 'Kom Lögreglan?',
      description: 'Label of did police arrive on scene input field',
    },
    municipality: {
      id: 'aosh.wan.application:accident.about.municipality',
      defaultMessage: 'Sveitarfélar slysstaðar',
      description: 'Label of municipality input field',
    },
    exactLocation: {
      id: 'aosh.wan.application:accident.about.exactLocation',
      defaultMessage: 'Nákvæm staðsetning',
      description: 'Label of exact location input field',
    },
    describeHeading: {
      id: 'aosh.wan.application:accident.about.describeHeading',
      defaultMessage: 'Lýstu tildrögum slyssins eins nákvæmlega og þú getur',
      description: 'Heading for the describe section of the about page',
    },
    describeDescription: {
      id: 'aosh.wan.application:accident.about.describeDescription',
      defaultMessage:
        'Lýsið tildrögum slysins í stuttu og einföldu máli. Hafið til hliðsjónar dæmið hér að neðan um lýsingu slyss þar sem fram koma þrír meginþættir, sbr. liði 1-3, hér á eftir.',
      description: 'Description for the describe section of the about page',
    },
    alertFieldTitle: {
      id: 'aosh.wan.application:accident.about.alertFieldTitle',
      defaultMessage: 'Vinsamlegast athugið',
      description: 'Title of the alert field on the about page',
    },
    alertFieldDescription: {
      id: 'aosh.wan.application:accident.about.alertFieldDescription',
      defaultMessage:
        'Vinsamlegast setjið ekki inn persónugreinanlegar upplýsingar í reitinn tildrög hér að neðan. Notið „slasaði“ (ef fleiri en einn, slasaði A, slasaði B, o.s.frv.) um þann sem slasast og ef aðrir komu að slysinu, notið þá samstarfsmaður/viðskiptavinur o.s.frv. eftir því hvað á við!',
      description: 'Description of the alert field on the about page',
    },
    wasDoingTitle: {
      id: 'aosh.wan.application:accident.about.wasDoingTitle',
      defaultMessage:
        'Lýsið því sem slasaði var að gera á því augnabliki, sem slysið varð.',
      description: 'Title of wasDoing text area',
    },
    wasDoingPlaceholder: {
      id: 'aosh.wan.application:accident.about.wasDoingPlaceholder#markdown',
      defaultMessage:
        'Tilgreinið hvaða verkfæri eða vélar voru notaðar.\nDæmi:\n  - Vann með handborvél\n  - Vann með handborvél',
      description: 'Placeholder of wasDoing text area',
    },
    wentWrongTitle: {
      id: 'aosh.wan.application:accident.about.wentWrongTitle',
      defaultMessage: 'Lýsið því sem fór úrskeiðis',
      description: 'Title of wentWrong text area',
    },
    wenWrongPlaceholder: {
      id: 'aosh.wan.application:accident.about.wenWrongPlaceholder#markdown',
      defaultMessage:
        'Tilgreinið hvaða verkfæri eða vélar voru notaðar.\nDæmi:\n  - Vann með handborvél\n  - Vann með handborvél',
      description: 'Placeholder of wentWrong text area',
    },
    howTitle: {
      id: 'aosh.wan.application:accident.about.howTitle',
      defaultMessage: 'Lýsið því hvernig slasaði hlaut áverka',
      description: 'Title of how text area',
    },
    howPlaceholder: {
      id: 'aosh.wan.application:accident.about.howPlaceholder#markdown',
      defaultMessage:
        'Tilgreinið hvaða verkfæri eða vélar voru notaðar.\nDæmi:\n  - Vann með handborvél\n  - Vann með handborvél',
      description: 'Placeholder of how text area',
    },
    locationOfAccidentHeading: {
      id: 'aosh.wan.application:accident.about.locationOfAccidentHeading',
      defaultMessage: 'Vettvangur slyssins',
      description: 'Heading for location of the accident section',
    },
    locationOfAccidentMajorGroup: {
      id: 'aosh.wan.application:accident.about.locationOfAccidentMajorGroup',
      defaultMessage: 'Yfirflokkur atvinnustarfsemi',
      description: 'Label for the major group input for accident location',
    },
    locationOfAccidentMinorGroup: {
      id: 'aosh.wan.application:accident.about.locationOfAccidentMinorGroup',
      defaultMessage: 'Undirflokkur starfseminnar',
      description: 'Label for the minor group input for accident location',
    },
  }),
}
