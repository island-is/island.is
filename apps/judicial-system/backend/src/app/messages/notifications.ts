import { defineMessages } from '@formatjs/intl'
import { CaseType } from '@island.is/judicial-system/types'

export const notifications = {
  prosecutorText: {
    id: 'judicial.system.backend:notifications.prosecutor_text',
    defaultMessage:
      'Sækjandi: {prosecutorName, select, NONE {Ekki skráður} other {{prosecutorName}}}.',
    description:
      'Notaður sem texti í sms-i til þess að tilgreina hver sækjandi er',
  },
  readyForCourt: defineMessages({
    prosecutorHtml: {
      id:
        'judicial.system.backend:notifications.ready_for_court.prosecutor_html_v1',
      defaultMessage:
        'Þú hefur sent kröfu um {caseType} á {courtName} vegna LÖKE máls {policeCaseNumber}. Skjalið er aðgengilegt undir {linkStart}málinu í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til ákæranda varðandi kröfu sem hefur verið send á héraðsdómara',
    },
  }),
  courtRevoked: defineMessages({
    caseTypeRevoked: {
      id:
        'judicial.system.backend:notifications.courtRevoked.case_type_revoked',
      defaultMessage: `{caseType, select, ${CaseType.TRAVEL_BAN} {Farbannskrafa} ${CaseType.ADMISSION_TO_FACILITY} {Krafa um vistun á viðeignandi stofnun} other {Gæsluvarðhaldskrafa}} afturkölluð.`,
      description: 'Notaður sem texti í sms-i til TODO',
    },
    prosecutorText: {
      id: 'judicial.system.backend:notifications.courtRevoked.prosecutor_text',
      defaultMessage:
        'Sækjandi: {prosecutorName, select, NONE {Ekki skráður} other {{prosecutorName}}}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hver sækjandi er',
    },
    courtDate: {
      id: 'judicial.system.backend:notifications.courtRevoked.court_date',
      defaultMessage: 'Fyrirtökutími: {date}, kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær fyrirtöku tími er',
    },
    requestedCourtDate: {
      id:
        'judicial.system.backend:notifications.courtRevoked.requested_court_date',
      defaultMessage: 'ÓVE fyrirtöku {date}, eftir kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær fyrirtöku tími er',
    },
  }),
  courtHeadsUp: defineMessages({
    arrestDateText: {
      id: 'judicial.system.backend:notifications.courtHeadsUp.arrest_date_text',
      defaultMessage: 'Viðkomandi handtekinn {date}, kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær handtöku tími er',
    },
    requestedCourtDateText: {
      id:
        'judicial.system.backend:notifications.courtHeadsUp.requested_court_date_text',
      defaultMessage: 'ÓE fyrirtöku {date}, eftir kl. {time}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvenær fyrirtöku tími er',
    },
    newCaseText: {
      id: 'judicial.system.backend:notifications.courtHeadsUp.new_case_text',
      defaultMessage: `Ný {caseType, select, ${CaseType.TRAVEL_BAN} {farbannskrafa} ${CaseType.ADMISSION_TO_FACILITY} {krafa um vistun á viðeignandi stofnun} ${CaseType.CUSTODY} {gæsluvarðhaldskrafa} ${CaseType.OTHER} {krafa um rannsóknarheimild} other {krafa um rannsóknarheimild ({courtTypeName})}} í vinnslu.`,
      description:
        'Notaður sem texti í sms-i til þess að tilgreina að mál sé komið í vinnslu',
    },
  }),
  courtReadyForCourt: defineMessages({
    submittedCase: {
      id:
        'judicial.system.backend:notifications.courtReadyForCourt.case_ready_for_court',
      defaultMessage: `{caseType, select, ${CaseType.TRAVEL_BAN} {Farbannskrafa} ${CaseType.ADMISSION_TO_FACILITY} {Krafa um vistun á viðeignandi stofnun} ${CaseType.CUSTODY} {Gæsluvarðhaldskrafa} ${CaseType.OTHER} {Krafa um rannsóknarheimild} other {Krafa um rannsóknarheimild ({courtTypeName})}} tilbúin til afgreiðslu.`,
      description: 'Notaður sem texti í sms-i til TODO',
    },
    prosecutorText: {
      id:
        'judicial.system.backend:notifications.courtReadyForCourt.prosecutor_text',
      defaultMessage:
        'Sækjandi: {prosecutorName, select, NONE {Ekki skráður} other {{prosecutorName}}}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hver sækjandi er',
    },
    courtText: {
      id: 'judicial.system.backend:notifications.courtReadyForCourt.court_text',
      defaultMessage:
        'Dómstóll: {court, select, NONE {Ekki skráður} other {{court}}}.',
      description:
        'Notaður sem texti í sms-i til þess að tilgreina hvaða dómstóll er skráður',
    },
  }),
  courtResubmittedToCourt: {
    id:
      'judicial.system.backend:notifications.courtRevoked.case_resubmitted_to_court',
    defaultMessage:
      'Sækjandi í máli {courtCaseNumber} hefur breytt kröfunni og sent aftur á héraðsdómstól. Nýtt kröfuskjal hefur verið vistað í Auði.',
    description:
      'Notaður sem texti í sms-i þegar sækjandi breytir kröfunni og sendir aftur á héraðsdómstól',
  },
  signedRuling: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.signed_ruling.subject',
      defaultMessage: 'Úrskurður í máli {courtCaseNumber}',
      description:
        'Notaður sem titill í pósti til hagaðila vegna undirritunar úrskúrðar',
    },
    rulingAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.ruling_attachment',
      defaultMessage: 'Úrskurður {courtCaseNumber}.pdf',
      description:
        'Notaður sem nafn á úrskurðarviðhengi í pósti til hagaðila vegna undirritunar úrskúrðar',
    },
    courtRecordAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.court_record_attachment',
      defaultMessage: 'Þingbók {courtCaseNumber}.pdf',
      description:
        'Notaður sem nafn á þingbókarviðhengi í pósti til hagaðila vegna undirritunar úrskúrðar',
    },
    prosecutorBodyS3: {
      id:
        'judicial.system.backend:notifications.signed_ruling.prosecutor_body_s3_v1',
      defaultMessage:
        'Dómari hefur undirritað og staðfest úrskurð í máli {courtCaseNumber} hjá {courtName}.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna undirritunar úrskúrðar ef tókst að vista úrskurð í AWS S3',
    },
    prosecutorBodyAttachment: {
      id:
        'judicial.system.backend:notifications.signed_ruling.prosecutor_body_attachment_v1',
      defaultMessage:
        '{courtName} hefur sent þér endurrit úr þingbók í máli {courtCaseNumber} ásamt úrskurði dómara í heild sinni í meðfylgjandi viðhengi.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til sækjanda vegna undirritunar úrskúrðar ef ekki tókst að vista úrskurð í AWS S3',
    },
    courtBody: {
      id: 'judicial.system.backend:notifications.signed_ruling.court_body',
      defaultMessage:
        'Ekki tókst að vista þingbók og/eða úrskurð í máli {courtCaseNumber} í Auði.<br /><br />Skjöl málsins eru aðengileg á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
      description:
        'Notaður sem texti í pósti til dómara og dómritara vegna undirritunar úrskúrðar ef ekki tókst að vista þingbók eða úrskurð í Auði',
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
  modified: defineMessages({
    subject: {
      id: 'judicial.system.backend:notifications.modified.subject',
      defaultMessage: 'Gæsluvarðhaldsmál {courtCaseNumber}',
      description:
        'Notaður sem titill á tölvupósti vegna breytingar á lengd gæslu/einangrunar þar sem {courtCaseNumber} er málsnúmer dómstóls.',
    },
    html: {
      id: 'judicial.system.backend:notifications.modified.html',
      defaultMessage:
        '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd gæslu í máli {courtCaseNumber}. Sjá {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Lok gæslu: {validToDate}.',
      description:
        'Notaður sem texti í tölvupósti vegna breytingar á lengd gæslu þar sem ekki var úrskurðað í einangrun.',
    },
    isolationHtml: {
      id: 'judicial.system.backend:notifications.modified.isolation_html',
      defaultMessage:
        '{actorInstitution}, {actorName} {actorTitle}, hefur uppfært lengd gæslu/einangrunar í máli {courtCaseNumber}. Sjá {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.<br /><br />Lok gæslu: {validToDate}.<br /><br />Lok einangrunar: {isolationToDate}.',
      description:
        'Notaður sem texti í tölvupósti vegna breytingar á lengd gæslu/einangrunar þar sem úrskurðað var í einangrun.',
    },
  }),
}
