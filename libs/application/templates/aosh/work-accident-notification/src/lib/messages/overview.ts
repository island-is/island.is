import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.wan.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    description: {
      id: 'aosh.wan.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en skráningin er send.',
      description: 'Description of overview page',
    },
    pageTitle: {
      id: 'aosh.wan.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    moreInjuredTitle: {
      id: 'aosh.wan.application:overview.general.moreInjuredTitle',
      defaultMessage: 'Slösuðust fleiri?',
      description: 'More injured title',
    },
    moreInjuredDescription: {
      id: 'aosh.wan.application:overview.general.moreInjuredDescription',
      defaultMessage:
        'Urna urna at habitasse viverra aliquam eget. Bibendum nunc eu vitae mattis lorem pharetra suscipit lectus sapien. Porta nec proin pretium magnis ac. Ac amet sed quisque in sed.',
      description: 'More injured description',
    },
    approveButton: {
      id: 'aosh.wan.application:overview.general.approveButton',
      defaultMessage: 'Staðfesta',
      description: 'contactInformation approveButton label',
    },
  }),
  labels: defineMessages({
    editMessage: {
      id: 'aosh.wan.application:overview.labels.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button',
    },
    dateAndTime: {
      id: 'aosh.wan.application:overview.labels.dateAndTime',
      defaultMessage: 'Dagsetning og tími slyss',
      description: 'Date and time label',
    },
    didAoshCome: {
      id: 'aosh.wan.application:overview.labels.didAoshCome',
      defaultMessage: 'Kom Vinnueftirlitið?',
      description: 'Date and time label',
    },
    didPoliceCome: {
      id: 'aosh.wan.application:overview.labels.didPoliceCome',
      defaultMessage: 'Kom Lögreglan?',
      description: 'Date and time label',
    },
    injuredAmount: {
      id: 'aosh.wan.application:overview.labels.injuredAmount',
      defaultMessage: 'Fjöldi slasaðra',
      description: 'Date and time label',
    },
    municipality: {
      id: 'aosh.wan.application:overview.labels.municipality',
      defaultMessage: 'Sveitarfélag þar sem slysið átti sér stað',
      description: 'Date and time label',
    },
    exactLocation: {
      id: 'aosh.wan.application:overview.labels.exactLocation',
      defaultMessage: 'Nákvæm staðsetning slyssins',
      description: 'Date and time label',
    },
    accidentDescription: {
      id: 'aosh.wan.application:overview.labels.accidentDescription',
      defaultMessage: 'Tildrög slyssins',
      description: 'Date and time label',
    },
    locationOfAccident: {
      id: 'aosh.wan.application:overview.labels.locationOfAccident',
      defaultMessage: 'Vettvangur slyssins',
      description: 'Date and time label',
    },
    employee: {
      id: 'aosh.wan.application:overview.labels.employee',
      defaultMessage: 'Starfsmaður',
      description: 'Employee label',
    },
    events: {
      id: 'aosh.wan.application:overview.labels.events',
      defaultMessage: 'Atburðir',
      description: 'Events label on overview page',
    },
    addEmployeeDescription: {
      id: 'aosh.wan.application:overview.labels.addEmployeeDescription',
      defaultMessage:
        'Ef það voru fleiri sem slösuðust er hægt að bæta við starfsmanni hér',
      description: 'Add employee description label',
    },
    addEmployeeButton: {
      id: 'aosh.wan.application:overview.labels.addEmployeeButton',
      defaultMessage: 'Bæta við slösuðum starfsmanni',
      description: 'Add employee button label',
    },
    email: {
      id: 'aosh.wan.application:overview.labels.email',
      defaultMessage: 'Netfang tengiliðs',
      description: 'Email of company ',
    },
    phonenumber: {
      id: 'aosh.wan.application:overview.labels.phonenumber',
      defaultMessage: 'Símanúmer tengiliðs',
      description: 'Phonenumber of company',
    },
    couldNotAddEmployee: {
      id: 'aosh.wan.application:overview.labels.couldNotAddEmployee',
      defaultMessage: 'Ekki tókst að bæta við nýjum starfsmanni.',
      description: 'Could not add employee error',
    },
    undefinedEmployeeAmount: {
      id: 'aosh.wan.application:overview.labels.undefinedEmployeeAmount',
      defaultMessage:
        'Fjöldi starfsmanna finnst ekki, og því ekki hægt að bæta við nýjum starfsmanni.',
      description: 'Undefined employee amount error',
    },
  }),
  employee: defineMessages({
    employees: {
      id: 'aosh.wan.application:overview.employee.employees',
      defaultMessage: 'Starfsmenn',
      description: 'Employees label',
    },
    nationality: {
      id: 'aosh.wan.application:overview.employee.nationality',
      defaultMessage: 'Þjóðerni',
      description: 'Employees nationality overview label',
    },
    employmentStatus: {
      id: 'aosh.wan.application:overview.employee.employmentStatus',
      defaultMessage: 'Ráðningarstaða',
      description: 'Employees employment status overview label',
    },
    startDate: {
      id: 'aosh.wan.application:overview.employee.startDate',
      defaultMessage: 'Hóf störf',
      description: 'Employees start date at company overview label',
    },
    employmentTime: {
      id: 'aosh.wan.application:overview.employee.employmentTime',
      defaultMessage: 'Starfstími við sama starf',
      description: 'Employees employment time overview label',
    },
    employmentRate: {
      id: 'aosh.wan.application:overview.employee.employmentRate',
      defaultMessage: 'Starfshlutfall %',
      description: 'Employees employment rate overview label',
    },
    workhourArrangement: {
      id: 'aosh.wan.application:overview.employee.workhourArrangement',
      defaultMessage: 'Tilhögun vinnutíma',
      description: 'Employees workhour arrangement overview label',
    },
    startTime: {
      id: 'aosh.wan.application:overview.employee.startTime',
      defaultMessage: 'Vinnutími slasaða á slysadegi hófst',
      description: 'Employee started work at time overview label',
    },
    workstation: {
      id: 'aosh.wan.application:overview.employee.workstation',
      defaultMessage: 'Starfsstöð',
      description: 'Employees employment time overview label',
    },
    occupationTitle: {
      id: 'aosh.wan.application:overview.employee.occupationTitle',
      defaultMessage: 'Starfsgrein slasaða',
      description: 'Employees occupation title overview label',
    },
  }),
  causeAndConsequences: defineMessages({
    absence: {
      id: 'aosh.wan.application:overview.causeAndConsequences.absence',
      defaultMessage: 'Fjarvera vegna slyss',
      description: 'Cause and consequences absence overview label',
    },
    circumstances: {
      id: 'aosh.wan.application:overview.causeAndConsequences.circumstances',
      defaultMessage: 'Slysið varð við',
      description: 'Cause and consequences circumstances overview label',
    },
    deviations: {
      id: 'aosh.wan.application:overview.causeAndConsequences.deviations',
      defaultMessage: 'Frávik í vinnuferli',
      description: 'Cause and consequences deviations overview label',
    },
    causeOfInjury: {
      id: 'aosh.wan.application:overview.causeAndConsequences.causeOfInjury',
      defaultMessage: 'Orsök áverka',
      description: 'Cause and consequences cause of injury overview label',
    },
    typeOfInjury: {
      id: 'aosh.wan.application:overview.causeAndConsequences.typeOfInjury',
      defaultMessage: 'Tegund áverka',
      description: 'Cause and consequences type of injury overview label',
    },
    injuredBodyParts: {
      id: 'aosh.wan.application:overview.causeAndConsequences.injuredBodyParts',
      defaultMessage: 'Líkamshlutar sem urðu fyrir áverkum',
      description: 'Cause and consequences injured body parts overview label',
    },
  }),
}
