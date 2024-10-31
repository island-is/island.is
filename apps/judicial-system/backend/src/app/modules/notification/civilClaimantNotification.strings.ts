import { defineMessage } from '@formatjs/intl'

export const strings = {
  civilClaimantAdvocateAssignedSubject: defineMessage({
    id: 'judicial.system.backend:civil_claimant_notifications.indictment_advocate_assigned_subject',
    defaultMessage: '{courtName} - aðgangur að máli',
    description:
      'Subject of the notification when a civil claimant spokesperson is assigned and confirmed',
  }),
  civilClaimantAdvocateAssignedBody: defineMessage({
    id: 'judicial.system.backend:civil_claimant_notifications.indictment_advocate_assigned_body',
    defaultMessage:
      '{courtName} hefur skráð þig {advocateType, select, LAWYER {lögmann einkaréttarkröfuhafa} LEGAL_RIGHTS_PROTECTOR {réttargæslumann einkaréttarkröfuhafa} other {verjanda}} í máli {courtCaseNumber}.<br /><br />{advocateHasAccessToRVG, select, true {Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Þú getur nálgast málið hjá dómstólnum.}}.',
    description:
      'Body of the notification when a civil claimant spokesperson is assigned and confirmed',
  }),
}
