import { defineMessage } from '@formatjs/intl'

export const strings = {
  defendantSelectedDefenderSubject: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.defendant_selected_defender_subject',
    defaultMessage: 'Val á verjanda í máli {courtCaseNumber}',
    description:
      'Subject of the notification sent when the defendant defender choise in an indictment has changed',
  }),
  defendantSelectedDefenderBody: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.defendant_selected_defender_body',
    defaultMessage:
      'Verjandi hefur verið valinn í máli {courtCaseNumber}.<br /><br />Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification sent when the defendant defender choise in an indictment has changed',
  }),
  defendantDelegatedDefenderChoiceSubject: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.defendant_delegated_defender_choice_subject',
    defaultMessage: 'Afstaða til verjanda í máli {courtCaseNumber}',
    description:
      'Body of the notification sent when the defendant delegates the defendant choice to the judge in indictment cases',
  }),
  defendantDelegatedDefenderChoiceBody: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.defendant_delegated_defender_choice_body',
    defaultMessage:
      'Afstaða: Ég fel dómara málsins að tilnefna og skipa mér verjanda.<br /><br />Sjá nánar á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}.',
    description:
      'Body of the notification sent when the defendant delegates the defendant choice to the judge in indictment cases',
  }),
  defenderAssignedSubject: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_defender_assigned_subject',
    defaultMessage: '{courtName} - aðgangur að máli',
    description:
      'Subject of the notification when a defender is assigned a confirmed as a defender in indictment cases',
  }),
  defenderAssignedBody: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_defender_assigned_body',
    defaultMessage:
      '{courtName} hefur skráð þig verjanda í máli {courtCaseNumber}.<br /><br />{defenderHasAccessToRVG, select, true {Hægt er að nálgast málið á {linkStart}yfirlitssíðu málsins í Réttarvörslugátt{linkEnd}} other {Þú getur nálgast málið hjá dómstólnum}}.',
    description:
      'Body of the notification when a defender is assigned a confirmed as a defender in indictment cases',
  }),
  indictmentSentToPrisonAdminSubject: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_sent_to_prison_admin_subject',
    defaultMessage: 'Mál {courtCaseNumber} til fullnustu',
    description:
      'Titill í tilkynningu til FMST þegar mál er sent til fullnustu',
  }),
  indictmentSentToPrisonAdminBody: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_sent_to_prison_admin_body_V1',
    defaultMessage:
      'Ríkissaksóknari hefur sent mál {courtCaseNumber} til fullnustu.<br /><br />Málið er aðgengilegt í {linkStart}Réttarvörslugátt{linkEnd}.',
    description: 'Texti í tilkynningu til FMST þegar mál er sent til fullnustu',
  }),
  indictmentWithdrawnFromPrisonAdminSubject: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_withdrawn_from_prison_admin_subject',
    defaultMessage: 'Mál {courtCaseNumber} afturkallað úr fullnustu',
    description:
      'Titill í tilkynningu til FMST þegar mál er afturkallað úr fullnustu',
  }),
  indictmentWithdrawnFromPrisonAdminBody: defineMessage({
    id: 'judicial.system.backend:defendant_notifications.indictment_withdrawn_from_prison_admin_body',
    defaultMessage:
      'Ríkissaksóknari hefur afturkallað mál {courtCaseNumber} úr fullnustu.',
    description:
      'Texti í tilkynningu til FMST þegar mál er afturkallað úr fullnustu',
  }),
}
