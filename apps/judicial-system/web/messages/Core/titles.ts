import { defineMessage } from 'react-intl'

export const titles = {
  prosecutor: {
    investigationCases: {
      defendant: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.investigation_cases.defendant',
        defaultMessage: 'Rannsóknarheimild - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir varnaraðila skjá hjá saksóknara í rannsóknarheimildum',
      }),
      hearingArrangements: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.investigation_cases.hearing_arrangements',
        defaultMessage: 'Óskir um fyrirtöku - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Óskir um fyrirtöku skjá hjá saksóknara í rannsóknarheimildum',
      }),
      policeDemands: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.investigation_cases.police_demands',
        defaultMessage: 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Dómkröfur og lagagrundvöllur skjá hjá saksóknara í rannsóknarheimildum',
      }),
      policeReport: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.investigation_cases.police_report',
        defaultMessage: 'Greinargerð - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Greinargerð skjá hjá saksóknara í rannsóknarheimildum',
      }),
      caseFiles: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.investigation_cases.case_files',
        defaultMessage: 'Rannsóknargögn - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Rannsóknargögn skjá hjá saksóknara í rannsóknarheimildum',
      }),
      overview: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.investigation_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá saksóknara í rannsóknarheimildum',
      }),
    },
    restrictionCases: {
      defendant: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.restriction_cases.defendant',
        defaultMessage: 'Varnaraðili - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir varnaraðila skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      hearingArrangements: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.restriction_cases.hearing_arrangements',
        defaultMessage: 'Óskir um fyrirtöku - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Óskir um fyrirtöku skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      policeDemands: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.restriction_cases.police_demands',
        defaultMessage: 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Dómkröfur og lagagrundvöllur skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      policeReport: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.restriction_cases.police_report',
        defaultMessage: 'Greinargerð - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Greinargerð skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      caseFiles: defineMessage({
        id:
          'judicial.system.core:titles.prosecutor.restriction_cases.case_files',
        defaultMessage: 'Rannsóknargögn - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Rannsóknargögn skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      overview: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.restriction_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
    },
  },
  court: {
    investigationCases: {
      receptionAndAssignment: defineMessage({
        id:
          'judicial.system.core:titles.court.investigation_cases.reception_and_assignment',
        defaultMessage: 'Móttaka - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Móttaka skjá hjá dómstólum í rannsóknarheimildum',
      }),
      overview: defineMessage({
        id: 'judicial.system.core:titles.court.investigation_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá dómstólum í rannsóknarheimildum',
      }),
      hearingArrangements: defineMessage({
        id:
          'judicial.system.core:titles.court.investigation_cases.hearing_arrangements',
        defaultMessage: 'Fyrirtaka - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Fyrirtaka skjá hjá dómstólum í rannsóknarheimildum',
      }),
      ruling: defineMessage({
        id: 'judicial.system.core:titles.court.investigation_cases.ruling',
        defaultMessage: 'Úrskurður - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Úrskurður skjá hjá dómstólum í rannsóknarheimildum',
      }),
      courtRecord: defineMessage({
        id:
          'judicial.system.core:titles.court.investigation_cases.court_record',
        defaultMessage: 'Þingbók - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Þingbók skjá hjá dómstólum í rannsóknarheimildum',
      }),
      conclusion: defineMessage({
        id: 'judicial.system.core:titles.court.investigation_cases.conclusion',
        defaultMessage: 'Yfirlit úrskurðar - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit úrskurðar skjá hjá dómstólum í rannsóknarheimildum',
      }),
    },
    restrictionCases: {
      receptionAndAssignment: defineMessage({
        id:
          'judicial.system.core:titles.court.restriction_cases.reception_and_assignment',
        defaultMessage: 'Móttaka - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Móttaka skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
      overview: defineMessage({
        id: 'judicial.system.core:titles.court.restriction_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
      hearingArrangements: defineMessage({
        id:
          'judicial.system.core:titles.court.restriction_cases.hearing_arrangements',
        defaultMessage: 'Fyrirtaka - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Fyrirtaka skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
      ruling: defineMessage({
        id: 'judicial.system.core:titles.court.restriction_cases.ruling',
        defaultMessage: 'Úrskurður - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Úrskurður skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
      courtRecord: defineMessage({
        id: 'judicial.system.core:titles.court.restriction_cases.court_record',
        defaultMessage: 'Þingbók - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Þingbók skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
      conclusion: defineMessage({
        id: 'judicial.system.core:titles.court.restriction_cases.conclusion',
        defaultMessage: 'Yfirlit úrskurðar - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit úrskurðar skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
    },
  },
  shared: {
    login: defineMessage({
      id: 'judicial.system.core:titles.shared.login',
      defaultMessage: 'Réttarvörslugátt',
      description: 'Notaður sem titill fyrir innskráningarskjá',
    }),
    cases: defineMessage({
      id: 'judicial.system.core:titles.shared.cases',
      defaultMessage: 'Öll mál - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir öll mál skjá',
    }),
    signedVerdictOverview: defineMessage({
      id: 'judicial.system.core:titles.shared.signed_verdict_overview',
      defaultMessage: 'Yfirlit - Afgreitt mál - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir Yfirlit úrskurðar skjá',
    }),
  },
  admin: {
    users: defineMessage({
      id: 'judicial.system.core:titles.admin.users',
      defaultMessage: 'Notendur - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir Notendur skjá í admin viðmóti',
    }),
    changeUser: defineMessage({
      id: 'judicial.system.core:titles.admin.change_user',
      defaultMessage: 'Breyta notanda - Réttarvörslugátt',
      description:
        'Notaður sem titill fyrir Breyta notanda skjá í admin viðmóti',
    }),
    newUser: defineMessage({
      id: 'judicial.system.core:titles.admin.new_user',
      defaultMessage: 'Nýr notandi - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir Nýr notandi skjá í admin viðmóti',
    }),
  },
}
