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
      id: 'aosh.wan.application:overview.company.pageTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    moreInjuredTitle: {
      id: 'aosh.wan.application:information.labels.moreInjuredTitle',
      defaultMessage: 'Slösuðust fleiri?',
      description: 'More injured title',
    },
    moreInjuredDescription: {
      id: 'aosh.wan.application:information.labels.moreInjuredDescription',
      defaultMessage:
        'Urna urna at habitasse viverra aliquam eget. Bibendum nunc eu vitae mattis lorem pharetra suscipit lectus sapien. Porta nec proin pretium magnis ac. Ac amet sed quisque in sed.',
      description: 'More injured description',
    },
  }),
  labels: defineMessages({
    editMessage: {
      id: 'aosh.wan.application:overview.labels.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button',
    },
    dateAndTime: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Dagsetning og tími slyss',
      description: 'Date and time label',
    },
    didAoshCome: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Kom Vinnueftirlitið?',
      description: 'Date and time label',
    },
    didPoliceCome: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Kom Lögreglan?',
      description: 'Date and time label',
    },
    injuredAmount: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Fjöldi slasaðra',
      description: 'Date and time label',
    },
    municipality: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Sveitarfélag þar sem slysið átti sér stað',
      description: 'Date and time label',
    },
    exactLocation: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Nákvæm staðsetning slyssins',
      description: 'Date and time label',
    },
    accidentDescription: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Tildrög slyssins',
      description: 'Date and time label',
    },
    locationOfAccident: {
      id: 'aosh.wan.application:information.labels.dateAndTime',
      defaultMessage: 'Vettvangur slyssins',
      description: 'Date and time label',
    },
    employee: {
      id: 'aosh.wan.application:information.labels.employee',
      defaultMessage: 'Starfsmaður',
      description: 'Employee label',
    },
    employeeDescription: {
      id: 'aosh.wan.application:information.labels.employeeDescription',
      defaultMessage:
        'Hægt er að senda umsóknir og önnur gögn með pósti, tölvupósti eða faxi. Læknisvottorð verða að berast með pósti þar sem við þurfum frumritið.',
      description: 'Employee description label',
    },
    causeAndConsequences: {
      id: 'aosh.wan.application:information.labels.causeAndConsequences',
      defaultMessage: 'Orsakir/afleiðingar slyss',
      description: 'Cause and consequences label',
    },
    addEmployeeDescription: {
      id: 'aosh.wan.application:information.labels.addEmployeeDescription',
      defaultMessage:
        'Ef það voru fleiri sem slösuðust er hægt að bæta við starfsmanni hér',
      description: 'Add employee description label',
    },
    addEmployeeButton: {
      id: 'aosh.wan.application:information.labels.addEmployeeButton',
      defaultMessage: 'Bæta við slösuðum starfsmanni',
      description: 'Add employee button label',
    },
  }),
  employee: defineMessages({
    nationality: {
      id: 'aosh.wan.application:information.employee.nationality',
      defaultMessage: 'Þjóðerni',
      description: 'Employees nationality overview label',
    },
    employmentStatus: {
      id: 'aosh.wan.application:information.employee.employmentStatus',
      defaultMessage: 'Ráðningarstaða',
      description: 'Employees employment status overview label',
    },
    startDate: {
      id: 'aosh.wan.application:information.employee.startDate',
      defaultMessage: 'Hóf störf',
      description: 'Employees start date at company overview label',
    },
    employmentTime: {
      id: 'aosh.wan.application:information.employee.employmentTime',
      defaultMessage: 'Starfstími við sama starf',
      description: 'Employees employment time overview label',
    },
    employmentRate: {
      id: 'aosh.wan.application:information.employee.employmentRate',
      defaultMessage: 'Starfshlutfall %',
      description: 'Employees employment rate overview label',
    },
    workhourArrangement: {
      id: 'aosh.wan.application:information.employee.workhourArrangement',
      defaultMessage: 'Tilhögun vinnutíma',
      description: 'Employees workhour arrangement overview label',
    },
    startTime: {
      id: 'aosh.wan.application:information.employee.startTime',
      defaultMessage: 'Vinnutími slasaða á slysadegi hófst',
      description: 'Employee started work at time overview label',
    },
    workstation: {
      id: 'aosh.wan.application:information.employee.workstation',
      defaultMessage: 'Starfsstöð',
      description: 'Employees employment time overview label',
    },
    occupationTitle: {
      id: 'aosh.wan.application:information.employee.occupationTitle',
      defaultMessage: 'Starfsgrein slasaða',
      description: 'Employees occupation title overview label',
    },
  }),
  causeAndConsequences: defineMessages({
    absence: {
      id: 'aosh.wan.application:information.causeAndConsequences.absence',
      defaultMessage: 'Fjarvera vegna slyss',
      description: 'Cause and consequences absence overview label',
    },
    circumstances: {
      id: 'aosh.wan.application:information.causeAndConsequences.circumstances',
      defaultMessage: 'Slysið varð við',
      description: 'Cause and consequences circumstances overview label',
    },
    deviations: {
      id: 'aosh.wan.application:information.causeAndConsequences.deviations',
      defaultMessage: 'Frávik í vinnuferli',
      description: 'Cause and consequences deviations overview label',
    },
    causeOfInjury: {
      id: 'aosh.wan.application:information.causeAndConsequences.causeOfInjury',
      defaultMessage: 'Orsök áverka',
      description: 'Cause and consequences cause of injury overview label',
    },
    typeOfInjury: {
      id: 'aosh.wan.application:information.causeAndConsequences.typeOfInjury',
      defaultMessage: 'Tegund áverka',
      description: 'Cause and consequences type of injury overview label',
    },
    injuredBodyParts: {
      id: 'aosh.wan.application:information.causeAndConsequences.injuredBodyParts',
      defaultMessage: 'Líkamshlutar sem urðu fyrir áverkum',
      description: 'Cause and consequences injured body parts overview label',
    },
  }),
}
