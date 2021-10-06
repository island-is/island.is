import { defineMessages } from 'react-intl'

export const icCourtRecord = {
  sections: {
    accusedAppealDecision: {
      options: defineMessages({
        accept: {
          id:
            'judicial.system.investigation_cases:court_record.accused_appeal_decision.options.accept',
          defaultMessage: 'Varnaraðili samþykkir kröfuna',
          description:
            'Notaður sem texti fyrir valmöguleikann "samþykkir kröfuna" í dómaraflæði í rannsóknarheimildum',
        },
        reject: {
          id:
            'judicial.system.investigation_cases:court_record.accused_appeal_decision.options.reject',
          defaultMessage: 'Varnaraðili mótmælir kröfunni',
          description:
            'Notaður sem texti fyrir valmöguleikann "hafnar kröfunni" í dómaraflæði í rannsóknarheimildum',
        },
        notApplicable: {
          id:
            'judicial.system.investigation_cases:court_record.accused_appeal_decision.options.not_applicable',
          defaultMessage: 'Á ekki við',
          description:
            'Notaður sem texti fyrir valmöguleikann "á ekki við" í dómaraflæði í rannsóknarheimildum',
        },
      }),
    },
    accusedPleaAnnouncement: defineMessages({
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.accused_plea_announcement.tooltip',
        defaultMessage: 'Nánari útlistun á afstöðu sakbornings',
        description:
          'Notaður sem skýritexti í "afstaða kærða" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
    litigationPresentations: defineMessages({
      autofill: {
        id:
          'judicial.system.investigation_cases:court_record.litigation_presentations.autofill',
        defaultMessage:
          'Málflutningur var skriflegur og gögn send dómara rafrænt.',
        description:
          'Notaður sem sjálfgefinn texti í "Málflutningur" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
    courtLocation: defineMessages({
      label: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.label',
        defaultMessage: 'Hvar var dómþing haldið?',
        description:
          'Notaður sem titill í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.placeholder',
        defaultMessage:
          'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
        description:
          'Notaður sem skýritexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.tooltip',
        defaultMessage:
          'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
        description:
          'Notaður sem upplýsingatexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
