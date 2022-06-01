import { defineMessages } from 'react-intl'

export const defenderInfo = {
  defenderNotFound: defineMessages({
    title: {
      id: 'judicial.system.core:defender_info.defender_not_found.title',
      defaultMessage: 'Lögmaður finnst ekki í félagatali Lögmannafélagsins',
      description:
        'Notaður sem titill í upplýsingasvæði við "Verjanda" svæði þegar verjandi finnst ekki í lögmannaskrá í öllum málategundum',
    },
    message: {
      id: 'judicial.system.core:defender_info.defender_not_found.message',
      defaultMessage:
        'Ekki tókst að finna skráðan lögmann í félagatali LMFÍ. Lögmaður mun ekki fá aðgengi að skjölum málsins í gegnum Réttarvörslugátt.',
      description:
        'Notaður sem texti í upplýsingasvæði við "Verjanda" svæði þegar verjandi finnst ekki í lögmannaskrá í öllum málategundum',
    },
  }),
}
