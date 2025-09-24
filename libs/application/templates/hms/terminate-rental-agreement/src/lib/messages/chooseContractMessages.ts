import { defineMessages } from 'react-intl'

export const chooseContractMessages = defineMessages({
  title: {
    id: 'tra.application:chooseContract.title',
    defaultMessage: 'Velja leigusamning',
    description: 'Choose contract title',
  },
  multiFieldTitle: {
    id: 'tra.application:chooseContract.multiFieldTitle',
    defaultMessage: 'Veldu leigusamning sem á að ljúka',
    description: 'Choose contract multi field title',
  },
  multiFieldDescription: {
    id: 'tra.application:chooseContract.multiFieldDescription',
    defaultMessage:
      'Hér má sjá lista yfir alla leigusamninga sem þú ert hluteigandi að, hvort sem er sem leigjandi eða leigusali. Vinsamlegast veldu samning til að ljúka.',
    description: 'Choose contract multi field description',
  },
  multiFieldDescriptionMarkdown: {
    id: 'tra.application:chooseContract.multiFieldDescription#markdown',
    defaultMessage:
      'Hér má sjá lista yfir alla leigusamninga sem þú ert aðili að. Vinsamlegast veldu samning sem á að ljúka. Upplýsingar um uppsögn eða riftun leigusamninga er að finna hér https://island.is/leiga-a-ibudarhusnaedi/uppsogn-eda-riftun-leigusamnings',
    description: 'Choose contract multi field description markdown',
  },
  option: {
    id: 'tra.application:chooseContract.option#markdown',
    defaultMessage:
      'Leigusamningur **{contractId}** (*{contractType}*)\n\n {address}{apartmentNumber}. \n\nLeigjandi/Leigjendur: {renters}. \n\nLeigusali/Leigusala: {landlords}',
    description: 'Choose contract option',
  },
  optionFixedTerm: {
    id: 'tra.application:chooseContract.optionFixedTerm#markdown',
    defaultMessage:
      'Leigusamningur **{contractId}** (*Tímabundin samningur*)\n\n {address}{apartmentNumber}. \n\nLeigjandi/Leigjendur: {renters}. \n\nLeigusali/Leigusala: {landlords}',
    description: 'Choose contract option fixed term',
  },
  optionUnboundTerm: {
    id: 'tra.application:chooseContract.optionUnboundTerm#markdown',
    defaultMessage:
      'Leigusamningur **{contractId}** (*Ótímabundin samningur*)\n\n {address}{apartmentNumber}. \n\nLeigjandi/Leigjendur: {renters}. \n\nLeigusali/Leigusala: {landlords}',
    description: 'Choose contract option unbound term',
  },
})
