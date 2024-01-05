import { defineMessages } from 'react-intl'

export const defenderInfo = {
  investigationCases: {
    sections: {
      defender: defineMessages({
        heading: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender.heading',
          defaultMessage: 'Verjandi varnaraðila',
          description:
            'Notaður sem titill fyrir "upplýsingar um verjanda varnaraðila" hlutann á varnaraðila skrefi í rannsóknarheimildum.',
        },
        title: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender.title',
          defaultMessage: '{defenderType}',
          description:
            'Notaður sem titill fyrir "Verjandi/talsmaður" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
        },
        tooltip: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender.tooltip',
          defaultMessage:
            'Lögmaður sem er valinn hér verður skipaður {sessionArrangement, select, ALL_PRESENT_SPOKESPERSON {talsmaður} other {verjandi}} í þinghaldi og fær sendan úrskurð rafrænt.',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á fyrirtöku skrefi í rannsóknarheimildum.',
        },
      }),
      defenderRequestAccess: defineMessages({
        title: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender_request_access.title',
          defaultMessage: 'Aðgangur verjanda að kröfu',
          description:
            'Notaður sem titill fyrir gáreiti á fyrirtöku skrefi í rannsóknarheimildum.',
        },
        labelCourtDate: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender_request_access.label',
          defaultMessage:
            'Gefa verjanda aðgang að kröfu við úthlutun fyrirtökutíma',
          description:
            'Notaður sem texti í "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í rannsóknarheimildum.',
        },
        labelReadyForCourt: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender_request_access.label_ready_for_court_access',
          defaultMessage:
            'Gefa verjanda aðgang að kröfu þegar krafa er send á dómstól',
          description:
            'Notaður sem texti í "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í rannsóknarheimildum.',
        },
        labelNoAccess: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender_request_access.label_no_access',
          defaultMessage: 'Ekki gefa verjanda aðgang að kröfu',
          description:
            'Notaður sem texti í "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í rannsóknarheimildum.',
        },
        tooltip: {
          id: 'judicial.system.core:defender_info.investigation_cases.sections.defender_request_access.tooltip',
          defaultMessage:
            'Ef hakað er hér þá fær verjandi aðgang að {caseType, select, ADMISSION_TO_FACILITY {kröfunni um vistun á viðeigandi stofnun} TRAVEL_BAN {farbannskröfunni} other {gæsluvarðhaldskröfunni}} þegar fyrirtökutíma hefur verið úthlutað',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í rannsóknarheimildum.',
        },
      }),
    },
  },
  restrictionCases: {
    sections: {
      defender: defineMessages({
        heading: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender.heading',
          defaultMessage: 'Verjandi sakbornings',
          description:
            'Notaður sem titill fyrir "upplýsingar um verjanda sakborning" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        title: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender.title',
          defaultMessage: 'Verjandi',
          description:
            'Notaður sem titill fyrir "Verjanda" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        tooltip: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender.tooltip',
          defaultMessage:
            'Lögmaður sem er valinn hér verður skipaður verjandi í þinghaldi og fær sendan úrskurð rafrænt.',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
      defenderRequestAccess: defineMessages({
        title: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender_request_access.title',
          defaultMessage: 'Aðgangur verjanda að kröfu',
          description:
            'Notaður sem titill fyrir gáreiti á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        labelCourtDate: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender_request_access.label',
          defaultMessage:
            'Gefa verjanda aðgang að kröfu við úthlutun fyrirtökutíma',
          description:
            'Notaður sem texti í "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        labelReadyForCourt: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender_request_access.label_ready_for_court_access',
          defaultMessage:
            'Gefa verjanda aðgang að kröfu þegar krafa er send á dómstól',
          description:
            'Notaður sem texti í "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        labelNoAccess: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender_request_access.label_no_access',
          defaultMessage: 'Ekki gefa verjanda aðgang að kröfu',
          description:
            'Notaður sem texti í "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        tooltip: {
          id: 'judicial.system.core:defender_info.restriction_cases.sections.defender_request_access.tooltip',
          defaultMessage:
            'Ef hakað er hér þá fær verjandi aðgang að {caseType, select, ADMISSION_TO_FACILITY {kröfunni um vistun á viðeigandi stofnun} TRAVEL_BAN {farbannskröfunni} other {gæsluvarðhaldskröfunni}} þegar fyrirtökutíma hefur verið úthlutað',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "Gefa verjanda aðgang..." gátreit á varnaraðila skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
    },
  },
}
