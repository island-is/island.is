import { defineMessages } from 'react-intl'

export const defenderInfo = {
  investigationCases: {
    sections: {
      defender: defineMessages({
        heading: {
          id:
            'judicial.system.core:defender_info.investigation_cases.sections.defender.heading',
          defaultMessage: 'Verjandi varnaraðila',
          description:
            'Notaður sem titill fyrir "upplýsingar um verjanda varnaraðila" hlutann á varnaraðila skrefi í rannsóknarheimildum.',
        },
        title: {
          id:
            'judicial.system.core:defender_info.investigation_cases.sections.defender.title',
          defaultMessage: '{defenderType}',
          description:
            'Notaður sem titill fyrir "Verjandi/talsmaður" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
        },
        tooltip: {
          id:
            'judicial.system.core:defender_info.investigation_cases.sections.defender.tooltip',
          defaultMessage:
            'Lögmaður sem er valinn hér verður skipaður {sessionArrangement, select, ALL_PRESENT_SPOKESPERSON {talsmaður} other {verjandi}} í þinghaldi og fær sendan úrskurð rafrænt.',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á fyrirtöku skrefi í rannsóknarheimildum.',
        },
      }),
      sendRequest: defineMessages({
        label: {
          id:
            'judicial.system.core:defender_info.investigation_cases.sections.send_request.label',
          defaultMessage:
            'Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma',
          description:
            'Notaður sem texti í "senda kröfu sjálfvirkt..." gátreit á varnaraðila skrefi í rannsóknarheimildum.',
        },
        tooltip: {
          id:
            'judicial.system.core:defender_info.investigation_cases.sections.send_request.tooltip',
          defaultMessage:
            'Ef hakað er hér þá fær verjandi kröfuna senda þegar fyrirtökutíma hefur verið úthlutað',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "senda kröfu sjálfvirkt..." gátreit á sakbornings skrefi í rannsóknarheimildum.',
        },
      }),
    },
  },
  restrictionCases: {
    sections: {
      defender: defineMessages({
        heading: {
          id:
            'judicial.system.core:defender_info.restriction_cases.sections.defender.heading',
          defaultMessage: 'Verjandi sakbornings',
          description:
            'Notaður sem titill fyrir "upplýsingar um verjanda sakborning" hlutann á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        title: {
          id:
            'judicial.system.core:defender_info.restriction_cases.sections.defender.title',
          defaultMessage: 'Verjandi',
          description:
            'Notaður sem titill fyrir "Verjanda" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        tooltip: {
          id:
            'judicial.system.core:defender_info.restriction_cases.sections.defender.tooltip',
          defaultMessage:
            'Lögmaður sem er valinn hér verður skipaður verjandi í þinghaldi og fær sendan úrskurð rafrænt.',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
      sendRequest: defineMessages({
        label: {
          id:
            'judicial.system.core:defender_info.restriction_cases.sections.send_request.label',
          defaultMessage:
            'Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma',
          description:
            'Notaður sem texti í "senda kröfu sjálfvirkt..." gátreit á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
        tooltip: {
          id:
            'judicial.system.core:defender_info.restriction_cases.sections.send_request.tooltip',
          defaultMessage:
            'Ef hakað er hér þá fær verjandi {caseType, select, ADMISSION_TO_FACILITY {kröfuna um vistun á viðeigandi stofnun} TRAVEL_BAN {farbannskröfuna} other {gæsluvarðhaldskröfuna}} senda þegar fyrirtökutíma hefur verið úthlutað',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "senda kröfu sjálfvirkt..." gátreit á sakbornings skrefi í gæsluvarðhalds- og farbannsmálum.',
        },
      }),
    },
  },
}
