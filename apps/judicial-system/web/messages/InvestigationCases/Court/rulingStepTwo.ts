import { defineMessage, defineMessages } from 'react-intl'

export const icRulingStepTwo = {
  title: defineMessage({
    id: 'judicial.system.investigation_cases:ruling_step_two.title',
    defaultMessage: 'Úrskurður og kæra',
    description:
      'Notaður sem titill á úrskurðar og kæru skrefi í rannsóknarheimildum.',
  }),
  sections: {
    conclusion: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.conclusion.label',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.conclusion.placeholder',
        defaultMessage: 'Hver eru úrskurðarorðin',
        description:
          'Notaður sem placeholder fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
    }),
    /* Depricated - remove in a later PR */
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
    /* Depricated - remove in a later PR */
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
    appealDecision: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.title',
        defaultMessage: 'Ákvörðun um kæru',
        description:
          'Notaður sem titill fyrir "Ákvörðun um kæru" hlutann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      disclaimer: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.disclaimer',
        defaultMessage:
          'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
        description:
          'Notaður sem texti í "Ákvörðun um kæru" hlutanum á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedTitle: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_title',
        defaultMessage: 'Afstaða varnaraðila til málsins í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Afstaða varnaraðila til málsins í lok þinghalds" spjald á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedAppeal: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_appeal',
        defaultMessage: 'Varnaraðili kærir úrskurðinn',
        description:
          'Notaður sem texti við valmöguleika varnaraðila um að kæra úrskurðinn radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedAccept: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_accept',
        defaultMessage: 'Varnaraðili unir úrskurðinum',
        description:
          'Notaður sem texti við valmöguleika varnaraðila um að una úrskurðinum radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedPostpone: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_postpone',
        defaultMessage: 'Varnaraðili tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika varnaraðila um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedNotApplicable: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_not_applicable',
        defaultMessage: 'Á ekki við',
        description:
          'Notaður sem texti við valmöguleika varnaraðila um á ekki við radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedAnnouncementLabel: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_announcement_label',
        defaultMessage: 'Yfirlýsing varnaraðila',
        description:
          'Notaður sem titill á "Yfirlýsing varnaraðila" innsláttarsvæði á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      accusedAnnouncementPlaceholder: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.accused_announcement_placeholder',
        defaultMessage:
          'Hér er hægt að bóka frekar um það sem varnaraðili vill taka fram ef við á.',
        description:
          'Notaður sem placeholder í "Yfirlýsing varnaraðila" innsláttarsvæði á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorTitle: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.prosecutor_title',
        defaultMessage: 'Afstaða sækjanda til málsins í lok þinghalds',
        description:
          'Notaður sem titill fyrir "Afstaða sækjanda til málsins í lok þinghalds" spjald á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorAppeal: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.prosecutor_appeal',
        defaultMessage: 'Sækjandi kærir úrskurðinn',
        description:
          'Notaður sem texti við valmöguleika sækjanda um að kæra úrskurðinn radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorAccept: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.prosecutor_accept',
        defaultMessage: 'Sækjandi unir úrskurðinum',
        description:
          'Notaður sem texti við valmöguleika sækjanda um að una úrskurðinum radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorPostpone: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.prosecutor_postpone',
        defaultMessage: 'Sækjandi tekur sér lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika sækjanda um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorPostponeInRemoteSession: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.prosecutor_postpone_in_remote_session',
        defaultMessage: 'Sækjandi fær lögboðinn frest',
        description:
          'Notaður sem texti við valmöguleika sækjanda um lögbundinn frest radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum þegar fyrirtakan er án munnlegs málflutnings.',
      },
      prosecutorNotApplicable: {
        id:
          'judicial.system.investigation_cases:ruling_step_two.appeal_decision.prosecutor_not_applicable',
        defaultMessage: 'Á ekki við',
        description:
          'Notaður sem texti við valmöguleika sækjanda um á ekki við radio takkann á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorAnnouncementLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_announcement_label',
        defaultMessage: 'Yfirlýsing sækjanda',
        description:
          'Notaður sem titill á "Yfirlýsing sækjanda" innsláttarsvæði á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
      prosecutorAnnouncementPlaceholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_two.appeal_decision.prosecutor_announcement_placeholder',
        defaultMessage:
          'Hér er hægt að bóka frekar um það sem sækjandi vill taka fram ef við á.',
        description:
          'Notaður sem placeholder í "Yfirlýsing sækjanda" innsláttarsvæði á úrskurðar og kæru skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
