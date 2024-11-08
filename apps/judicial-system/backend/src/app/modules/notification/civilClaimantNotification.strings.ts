import { defineMessage } from '@formatjs/intl'

export const strings = {
  civilClaimantSpokespersonAssignedSubject: defineMessage({
    id: 'judicial.system.backend:civil_claimant_notifications.spokesperson_assigned_subject',
    defaultMessage: '{courtName} - aðgangur að máli',
    description:
      'Subject of the notification when a civil claimant spokesperson is assigned and confirmed',
  }),
  civilClaimantSpokespersonAssignedBody: defineMessage({
    id: 'judicial.system.backend:civil_claimant_notifications.indictment_assigned_body',
    defaultMessage:
      '{courtName} hefur skráð þig {spokespersonIsLawyer, select, true {lögmann einkaréttarkröfuhafa} other {réttargæslumann einkaréttarkröfuhafa}} í máli {courtCaseNumber}.<br /><br />{spokespersonHasAccessToRVG, select, true {Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Þú getur nálgast málið hjá dómstólnum.}}.',
    description:
      'Body of the notification when a civil claimant spokesperson is assigned and confirmed',
  }),
}
