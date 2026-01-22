import { defineMessage, defineMessages } from 'react-intl'

export const titles = {
  prosecutor: {
    investigationCases: {
      defendant: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.investigation_cases.defendant',
        defaultMessage: 'Rannsóknarheimild - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir varnaraðila skjá hjá saksóknara í rannsóknarheimildum',
      }),
      hearingArrangements: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.investigation_cases.hearing_arrangements',
        defaultMessage: 'Óskir um fyrirtöku - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Óskir um fyrirtöku skjá hjá saksóknara í rannsóknarheimildum',
      }),
      policeDemands: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.investigation_cases.police_demands',
        defaultMessage: 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Dómkröfur og lagagrundvöllur skjá hjá saksóknara í rannsóknarheimildum',
      }),
      policeReport: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.investigation_cases.police_report',
        defaultMessage: 'Greinargerð - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Greinargerð skjá hjá saksóknara í rannsóknarheimildum',
      }),
      overview: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.investigation_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá saksóknara í rannsóknarheimildum',
      }),
    },
    restrictionCases: {
      defendant: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.restriction_cases.defendant',
        defaultMessage: 'Varnaraðili - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir varnaraðila skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      hearingArrangements: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.restriction_cases.hearing_arrangements',
        defaultMessage: 'Óskir um fyrirtöku - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Óskir um fyrirtöku skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      policeDemands: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.restriction_cases.police_demands',
        defaultMessage: 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Dómkröfur og lagagrundvöllur skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      policeReport: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.restriction_cases.police_report',
        defaultMessage: 'Greinargerð - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Greinargerð skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
      overview: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.restriction_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá saksóknara í gæslu- og farbannsmálum',
      }),
    },
    indictments: {
      defendant: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.defendant',
        defaultMessage: 'Ákærði - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir ákærða skjá hjá saksóknara í ákærum',
      }),
      processing: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.processing',
        defaultMessage: 'Málsmeðferð - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Málsmeðferð skjá hjá saksóknara í ákærum',
      }),
      indictment: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.indictment',
        defaultMessage: 'Ákæra - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Ákæra skjá hjá saksóknara í ákærum',
      }),
      caseFiles: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.case_files',
        defaultMessage: 'Dómskjöl - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Dómskjöl skjá hjá saksóknara í ákærum',
      }),
      caseFile: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.case_file',
        defaultMessage: 'Skjalaskrá - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Skjalaskrá skjá hjá saksóknara í ákærum',
      }),
      policeCaseFiles: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.police_case_files',
        defaultMessage: 'Málsgögn - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Málsgögn skjá hjá saksóknara í ákærum',
      }),
      overview: defineMessage({
        id: 'judicial.system.core:titles.prosecutor.indictments.overview',
        defaultMessage: 'Yfirlit ákæru - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit ákæru skjá hjá saksóknara í ákærum',
      }),
    },
  },
  court: {
    shared: {
      receptionAndAssignment: defineMessage({
        id: 'judicial.system.core:titles.court.shared.reception_and_assignment',
        defaultMessage: 'Móttaka - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Móttaka skjá hjá dómstólum í öllum málategundum',
      }),
    },
    investigationCases: {
      overview: defineMessage({
        id: 'judicial.system.core:titles.court.investigation_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá dómstólum í rannsóknarheimildum',
      }),
      hearingArrangements: defineMessage({
        id: 'judicial.system.core:titles.court.investigation_cases.hearing_arrangements',
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
        id: 'judicial.system.core:titles.court.investigation_cases.court_record',
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
      overview: defineMessage({
        id: 'judicial.system.core:titles.court.restriction_cases.overview',
        defaultMessage: 'Yfirlit kröfu - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit kröfu skjá hjá dómstólum í gæslu- og farbannsmálum',
      }),
      hearingArrangements: defineMessage({
        id: 'judicial.system.core:titles.court.restriction_cases.hearing_arrangements',
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
    indictments: defineMessages({
      overview: {
        id: 'judicial.system.core:titles.court.indictments.overview',
        defaultMessage: 'Yfirlit ákæru - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Yfirlit úrskurðar skjá hjá dómstólum í ákærum',
      },
      subpoena: {
        id: 'judicial.system.core:titles.court.indictments.subpoena',
        defaultMessage: 'Fyrirkall - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Fyrirkall skjá hjá dómstólum í ákærum',
      },
      defender: {
        id: 'judicial.system.core:titles.court.indictments.defender',
        defaultMessage: 'Verjendur - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir verjenda skjá hjá dómstólum í ákærum',
      },
      conclusion: {
        id: 'judicial.system.core:titles.court.indictments.conclusion_v1',
        defaultMessage: 'Staða og lyktir - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Staða og lyktir úrskurðar skjá hjá dómstólum í ákærum',
      },
      completed: {
        id: 'judicial.system.core:titles.court.indictments.completed',
        defaultMessage: 'Máli lokið - Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir Máli lokið skjá hjá dómstólum í ákærum',
      },
    }),
  },
  defender: {
    caseOverview: defineMessage({
      id: 'judicial.system.core:titles.defender.case_overview',
      defaultMessage: 'Yfirlit - Verjandi - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir Yfirlit máls skjá hjá verjanda',
    }),
    cases: defineMessage({
      id: 'judicial.system.core:titles.defender.cases',
      defaultMessage: 'Öll mál - Verjandi - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir öll mál skjá hjá verjanda',
    }),
  },
  shared: {
    closedCaseOverview: defineMessage({
      id: 'judicial.system.core:titles.shared.closed_case_overview',
      defaultMessage: '{courtCaseNumber} - Réttarvörslugátt',
      description:
        'Notaður sem titill fyrir skjá sem birtir upplýsingar um lokið mál',
    }),
    appealToCourtOfAppeals: defineMessage({
      id: 'judicial.system.core:titles.shared.appeal_to_court_of_appeals',
      defaultMessage: 'Kæra til Landsréttar - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir Kæra til Landsréttar skjá',
    }),
    withdrawAppeal: defineMessage({
      id: 'judicial.system.core:titles.shared.withdraw_appeal',
      defaultMessage: 'Niðurfelling kæru - Réttarvörslugátt',
      description: 'Notaður sem titill fyrir Niðurfelling kæru skjá',
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
