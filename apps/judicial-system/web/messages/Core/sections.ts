import { CaseType } from '@island.is/judicial-system/types'
import { defineMessages } from 'react-intl'

export const sections = {
  // TODO: remove custodyAndTravelBanProsecutorSection, it's renamed to restrictionCaseProsecutorSection
  custodyAndTravelBanProsecutorSection: defineMessages({
    custodyTitle: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.custody_title',
      defaultMessage: 'Krafa um gæsluvarðhald',
      description:
        'Notaður sem titill í hliðarstiku í gæsluvarðhaldsmálum hjá sækjendum',
    },
    travelBanTitle: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.travel_ban_title',
      defaultMessage: 'Krafa um farbann',
      description:
        'Notaður sem titill í hliðarstiku í farbannsmálum hjá sækjendum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.custody_and_travel_ban_prosecutor_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
  }),
  restrictionCaseProsecutorSection: defineMessages({
    caseTitle: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.case_title',
      defaultMessage: `Krafa um {caseType, select, ${CaseType.ADMISSION_TO_FACILITY} {vistun á viðeigandi stofnun} ${CaseType.TRAVEL_BAN} {farbann} other {gæsluvarðhald}}`,
      description:
        'Notaður sem titill í hliðarstiku í gæslu-, farbanns- og vistunarmálum hjá sækjendum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í gæslu- og farbannsmálum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.restriction_case_prosecutor_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í gæslu-, vinstunar- og farbannsmálum hjá sækjendum',
    },
  }),
  investigationCaseProsecutorSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.title',
      defaultMessage: 'Krafa um rannsóknarheimild',
      description:
        'Notaður sem titill í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.investigation_case_prosecutor_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í rannsóknarheimildum hjá sækjendum',
    },
  }),
  investigationCaseCourtSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.title',
      defaultMessage: 'Úrskurður Héraðsdóms',
      description:
        'Notaður sem titill í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    overview: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.hearingArrangements',
      defaultMessage: 'Fyrirtaka',
      description:
        'Notaður sem texti fyrir Fyrirtaka skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    courtRecord: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.court_record',
      defaultMessage: 'Þingbók',
      description:
        'Notaður sem texti fyrir Þingbók skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    ruling: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.ruling',
      defaultMessage: 'Úrskurður',
      description:
        'Notaður sem texti fyrir Úrskurður skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
    conclusion: {
      id:
        'judicial.system.core:sections.investigation_case_court_section.conclusion',
      defaultMessage: 'Yfirlit úrskurðar',
      description:
        'Notaður sem texti fyrir Yfirlit úrskurðar skref í hliðarstiku í rannsóknarheimildum hjá héraðsdómum',
    },
  }),
  courtSection: defineMessages({
    title: {
      id: 'judicial.system.core:sections.court_section.title',
      defaultMessage: 'Úrskurður Héraðsdóms',
      description:
        'Notaður sem titill í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    receptionAndAssignment: {
      id:
        'judicial.system.core:sections.court_section.reception_and_assignment',
      defaultMessage: 'Móttaka',
      description:
        'Notaður sem texti fyrir Móttaka skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    overview: {
      id: 'judicial.system.core:sections.court_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    hearingArrangements: {
      id: 'judicial.system.core:sections.court_section.hearingArrangements',
      defaultMessage: 'Fyrirtaka',
      description:
        'Notaður sem texti fyrir Fyrirtaka skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    courtRecord: {
      id: 'judicial.system.core:sections.court_section.court_record',
      defaultMessage: 'Þingbók',
      description:
        'Notaður sem texti fyrir Þingbók skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    ruling: {
      id: 'judicial.system.core:sections.court_section.ruling',
      defaultMessage: 'Úrskurður',
      description:
        'Notaður sem texti fyrir Úrskurður skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
    conclusion: {
      id: 'judicial.system.core:sections.court_section.conclusion',
      defaultMessage: 'Yfirlit úrskurðar',
      description:
        'Notaður sem texti fyrir Yfirlit úrskurðar skref í hliðarstiku í gæslu- og farbannsmálum hjá héraðsdómum',
    },
  }),
  extensionSection: defineMessages({
    title: {
      id: 'judicial.system.core:sections.extension_section.title',
      defaultMessage: 'Krafa um framlengingu',
      description:
        'Notaður sem titill í hliðarstiku í framlengingdum gæslu- og farbannsmálum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.extension_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    policeDemands: {
      id: 'judicial.system.core:sections.extension_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    policeReport: {
      id: 'judicial.system.core:sections.extension_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    caseFiles: {
      id: 'judicial.system.core:sections.extension_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
    overview: {
      id: 'judicial.system.core:sections.extension_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í framlengdum gæslu- og farbannsmálum hjá sækjendum',
    },
  }),
  investigationCaseExtensionSection: defineMessages({
    title: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.title',
      defaultMessage: 'Krafa um framlengingu',
      description:
        'Notaður sem titill í hliðarstiku í framlengingdum rannsóknarheimildum',
    },
    hearingArrangements: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.hearing_arrangements',
      defaultMessage: 'Óskir um fyrirtöku',
      description:
        'Notaður sem texti fyrir Óskir um fyrirtöku skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    policeDemands: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.police_demands',
      defaultMessage: 'Dómkröfur og lagagrundvöllur',
      description:
        'Notaður sem texti fyrir Dómkröfur og lagagrundvöllur skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    policeReport: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.police_report',
      defaultMessage: 'Greinargerð',
      description:
        'Notaður sem texti fyrir Greinargerð skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    caseFiles: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.case_files',
      defaultMessage: 'Rannsóknargögn',
      description:
        'Notaður sem texti fyrir Rannsóknargögn skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
    overview: {
      id:
        'judicial.system.core:sections.investigation_case_extension_section.overview',
      defaultMessage: 'Yfirlit kröfu',
      description:
        'Notaður sem texti fyrir Yfirlit kröfu skref í hliðarstiku í framlengdum rannsóknarheimildum hjá sækjendum',
    },
  }),
  caseResults: defineMessages({
    dissmissed: {
      id: 'judicial.system.core:sections.case_results.dissmissed',
      defaultMessage: 'Kröfu vísað frá',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar kröfu er vísað frá',
    },
    restrictionActive: {
      id: 'judicial.system.core:sections.case_results.restriction_active',
      defaultMessage: `{caseType, select, ${CaseType.ADMISSION_TO_FACILITY} {Vistun á stofnun virk} ${CaseType.TRAVEL_BAN} {Farbann virkt} other {Gæsluvarðhald virkt}}`,
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar gæslu/farbann/vistun er virk',
    },
    restrictionOver: {
      id: 'judicial.system.core:sections.case_results.restriction_active',
      defaultMessage: `{caseType, select, ${CaseType.ADMISSION_TO_FACILITY} {Vistun á stofnun} ${CaseType.TRAVEL_BAN} {Farbanni} other {Gæsluvarðhaldi}} lokið`,
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar gæslu/farbann/vistun er lokið',
    },
    result: {
      id: 'judicial.system.core:sections.case_results.result',
      defaultMessage: 'Niðurstaða',
      description: 'Notaður sem titill í hliðarstiku í niðurstöðum',
    },
    rejected: {
      id: 'judicial.system.core:sections.case_results.rejected',
      defaultMessage:
        'Kröfu {isInvestigationCase, select, yes {um rannsóknarheimild } other {}}hafnað',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar kröfu er hafnað',
    },
    investigationAccepted: {
      id: 'judicial.system.core:sections.case_results.investigation_accepted',
      defaultMessage: 'Krafa um rannsóknarheimild samþykkt',
      description:
        'Notaður sem texti í skrefum á hliðarstiku þegar kröfu er samþykkt',
    },
  }),
}
