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
  option: {
    id: 'tra.application:chooseContract.option#markdown',
    defaultMessage:
      'Leigusamningur **{contractId}** (*{contractType}*)\n\n {address}{apartmentNumber}',
    description: 'Choose contract option',
  },
})
