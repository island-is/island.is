import { defineMessages } from 'react-intl'

export const icRulingStepTwo = {
  sections: {
    accusedAppealDecision: defineMessages({
      disclaimer: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.accused_appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
    }),
    prosecutorAppealDecision: defineMessages({
      decisionPostpone: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.prosecutor_appeal_decision.decision_postpone',
        defaultMessage: 'Sækjandi tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleikan um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      decisionPostponeInRemoteSession: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.prosecutor_appeal_decision.decision_postpone_in_remote_session',
        defaultMessage: 'Sækjandi fær lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleikan um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum þegar fyrirtakan er án munnlegs málflutnings.',
      },
    }),
  },
}
