import { defineMessages } from 'react-intl'

export const certificateOfTenure = {
  general: defineMessages({
    title: {
      id: 'aosh.tlwm.application:certificateOfTenure.general.title',
      defaultMessage: 'Starfstími á vinnuvél',
      description: 'Title of certificateOfTenure screen',
    },
    sectionTitle: {
      id: 'aosh.tlwm.application:certificateOfTenure.general.sectionTitle',
      defaultMessage: 'Starfstími á vinnuvél',
      description: 'Section title of certificateOfTenure screen',
    },
    description: {
      id: 'aosh.tlwm.application:certificateOfTenure.general.description',
      defaultMessage:
        'Vinsamlegast fylltu út upplýsingar um þá vél sem þú hefur unnið á. Hægt er að sækja um kennsluréttindi á einn vinnuvélaflokk í hverri umsókn. ',
      description: 'Description of certificateOfTenure screen',
    },
  }),
  labels: defineMessages({
    registerMachineButtonText: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.registerMachineButtonText',
      defaultMessage: 'Skrá vinnuvél',
      description: 'Certificate of tenure register machine button label',
    },
    practicalRight: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.practicalRight',
      defaultMessage: 'Verkleg réttindi',
      description: 'Certificate of tenure practical right label',
    },
    practicalRightPlaceholder: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.practicalRightPlaceholder',
      defaultMessage: 'Veldu verkleg réttindi',
      description: 'Certificate of tenure practical right placeholder',
    },
    machineNumber: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.machineNumber',
      defaultMessage: 'Vinnuvélanúmer',
      description: 'Certificate of tenure machine number label',
    },
    machineType: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.machineType',
      defaultMessage: 'Tegund vélar',
      description: 'Certificate of tenure machine type label',
    },
    tenureInHours: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.tenureInHours',
      defaultMessage: 'Starfstími í klst',
      description: 'Certificate of tenure in hours label',
    },
    dateFrom: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.dateFrom',
      defaultMessage: 'Dagsetning frá',
      description: 'Certificate of tenure date from label',
    },
    dateTo: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.dateTo',
      defaultMessage: 'Dagsetning til',
      description: 'Certificate of tenure date to label',
    },
    datePlaceholder: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.datePlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Certificate of tenure date placeholder',
    },
    period: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.period',
      defaultMessage: 'Tímabil',
      description: 'Certificate of tenure period',
    },
    approveMachines: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.approveMachines',
      defaultMessage:
        'Það vottast hér með að ég hef stjórnað og  fylgst með viðhaldi eftirtalinna véla.',
      description: 'Certificate of tenure approve machines label',
    },
    tenureInHoursError: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.tenureInHoursError',
      defaultMessage: 'Starfstími þarf að hafa náð 1000 klst.',
      description: 'Certificate of tenure tenure in hours error message',
    },
    unknownPracticalRight: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.unknownPracticalRight',
      defaultMessage:
        'Þú hefur ekki réttindi til þess að sækja um kennsluréttindi í þessum vélaflokk.',
      description: 'Certificate of tenure unknown practical right label',
    },
    wrongPracticalRight: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.wrongPracticalRight',
      defaultMessage:
        'Vinnuvélanúmerið sem þú skráðir passar ekki. Öll vinnuvélanúmer byrja á tveimur bókstöfum, samstæður sem eru leyfilegar sem byrja á {firstLetter} eru {allAggregates}. Dæmi um vinnuvélanúmer er AB9999.',
      description: 'Certificate of tenure unknown practical right label',
    },
    unknownMachineType: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.unknownMachineType',
      defaultMessage:
        'Ekki finnst tegund vélar út frá innskráðu vinnuvélanúmeri.',
      description: 'Certificate of tenure unknown machine type label',
    },
    alreadyHaveTrainingLicense: {
      id: 'aosh.tlwm.application:certificateOfTenure.labels.alreadyHaveTrainingLicense',
      defaultMessage: 'Þú ert nú þegar með kennsluréttindi á þessa vél.',
      description: 'Certificate of tenure already have training license label',
    },
  }),
}
