import { defineMessages } from 'react-intl'

export const draftMessages = {
  personalInformation: defineMessages({
    title: {
      id: 'hb.application:draft.title',
      defaultMessage: 'Persónuupplýsingar',
      description: 'Personal information title',
    },
  }),
  rentalAgreement: defineMessages({
    title: {
      id: 'hb.application:draft.rentalAgreement.title',
      defaultMessage: 'Leigusamningur',
      description: 'Rental agreement title',
    },
    description: {
      id: 'hb.application:draft.rentalAgreement.description',
      defaultMessage:
        'Veldu þann leigusamning sem á að sækja húsnæðisbætur fyrir',
      description: 'Rental agreement description',
    },
    multiFieldDescription: {
      id: 'hb.application:draft.rentalAgreement.multiFieldDescription#markdown',
      defaultMessage:
        'Hér má sjá lista yfir alla leigusamninga sem þú ert aðili að. Vinsamlegast veldu samning sem á að sækja húsnæðisbætur fyrir.',
      description: 'Rental agreement multi field description',
    },
    optionFixedTerm: {
      id: 'hb.application:draft.rentalAgreement.optionFixedTerm#markdown',
      defaultMessage:
        'Leigusamningur **{contractId}** (*Tímabundin samningur*)\n\n{address}{apartmentNumber}\n\n{landlordsCount, plural, one {Leigusali} other {Leigusala}}: {landlords}\n\n{rentersCount, plural, one {Leigjandi} other {Leigjendur}}: {renters}',
      description: 'Rental agreement option fixed term',
    },
    optionUnboundTerm: {
      id: 'hb.application:draft.rentalAgreement.optionUnboundTerm#markdown',
      defaultMessage:
        'Leigusamningur **{contractId}** (*Ótímabundin samningur*)\n\n{address}{apartmentNumber}\n\n{landlordsCount, plural, one {Leigusali} other {Leigusala}}: {landlords}\n\n{rentersCount, plural, one {Leigjandi} other {Leigjendur}}: {renters}',
      description: 'Rental agreement option unbound term',
    },
  }),
}
