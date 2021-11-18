import { defineMessages } from '@formatjs/intl'

export const m = {
  readyForCourt: defineMessages({
    prosecutorHtml: {
      id:
        'judicial.system.backend:notifications.ready_for_court.prosecutor_html',
      defaultMessage:
        'Þú hefur sent kröfu um {caseType} á {courtName} vegna LÖKE máls {policeCaseNumber}. Skjalið er aðgengilegt undir málinu í Réttarvörslugátt.',
      description:
        'Notaður sem texti í pósti til ákæranda varðandi kröfu sem hefur verið send á héraðsdómara',
    },
  }),
  signedRuling: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.signed_ruling.subject',
      defaultMessage: 'Úrskurður í máli {courtCaseNumber}',
      description:
        'Notaður sem titill í pósti til hagaðila vegna undirritunar úrskúrðar',
    },
    attachment: {
      id: 'judicial.system.backend:notifications.signed_ruling.attachment',
      defaultMessage: 'Þingbók og úrskurður {courtCaseNumber}.pdf',
      description:
        'Notaður sem nafn á viðhengi í pósti til hagaðila vegna undirritunar úrskúrðar',
    },
    prosecutorBodyS3: {
      id:
        'judicial.system.backend:notifications.signed_ruling.prosecutor_body_s3',
      defaultMessage:
        'Dómari hefur undirritað og staðfest úrskurð í máli {courtCaseNumber} hjá {courtName}. Úrskurðurinn með rafrænni undirritun dómara er aðgengilegur undir málinu í Réttarvörslugátt.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna undirritunar úrskúrðar ef tókst að vista úrskurð í AWS S3',
    },
    prosecutorBodyAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.prosecutor_body_attachment',
      defaultMessage:
        '{courtName} hefur sent þér endurrit úr þingbók í máli {courtCaseNumber} ásamt úrskurði dómara í heild sinni í meðfylgjandi viðhengi.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna undirritunar úrskúrðar ef ekki tókst að vista úrskurð í AWS S3',
    },
    courtBodyAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.court_body_attachment',
      defaultMessage: 'Ekki tókst að vista meðfylgjandi skjal í Auði.',
      description:
        'Notaður sem texti í pósti til dómara og dómritara vegna undirritunar úrskúrðar ef ekki tókst að vista úrskurð í Auði',
    },
    defenderBodyAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.defender_body_attachment',
      defaultMessage:
        '{courtName} hefur sent þér endurrit úr þingbók í máli {courtCaseNumber} ásamt úrskurði dómara í heild sinni í meðfylgjandi viðhengi.',
      description:
        'Notaður sem texti í pósti til verjanda/talsmanns vegna undirritunar úrskúrðar',
    },
  }),
}
