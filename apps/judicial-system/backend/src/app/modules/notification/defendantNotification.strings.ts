import { defineMessage } from '@formatjs/intl'

export const strings = {
  indictmentAdvocateAssignedSubject: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_advocate_assigned_subject',
    defaultMessage: '{courtName} - aðgangur að máli',
    description:
      'Subject of the notification when a defender is assigned a confirmed as an advocate in indictment cases',
  }),
  indictmentAdvocateAssignedBody: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_advocate_assigned_body',
    defaultMessage:
      '{courtName} hefur skráð þig verjanda í máli {courtCaseNumber}.<br /><br />Hægt er að nálgast málið á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification when a defender is assigned a confirmed as an advocate in indictment cases',
  }),
}
