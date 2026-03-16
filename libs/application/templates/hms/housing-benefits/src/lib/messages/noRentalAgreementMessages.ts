import { defineMessages } from 'react-intl'

export const noRentalAgreementMessages = defineMessages({
  title: {
    id: 'hb.application:noRentalAgreement.title',
    defaultMessage: 'Enginn leigusamningur',
    description: 'No rental agreement screen title',
  },
  multiFieldTitle: {
    id: 'hb.application:noRentalAgreement.multiFieldTitle',
    defaultMessage: 'Enginn leigusamningur fannst',
    description: 'No rental agreement screen multi field title',
  },
  description: {
    id: 'hb.application:noRentalAgreement.description#markdown',
    defaultMessage:
      'Við fundum engan virkan leigusamning sem hægt er að sækja um húsnæðisbætur fyrir. Til að sækja um húsnæðisbætur þarf að: \n\n * Hafa gildan leigusamning til staðar.\n\n * Þú þarft að vera skráð/ur sem leigjandi á leigusamningnum.\n\n * Hafa leigusamning sem er ótímabundinn.\n\n * Hafa leigusamning sem gildir að minnsta kosti 3 mánuði fram í tímann.',
    description: 'No rental agreement screen description',
  },
  description2: {
    id: 'hb.application:noRentalAgreement.description2#markdown',
    defaultMessage:
      'Ef þú hefur nýlega undirritað leigusamning er hann kannski ekki enn kominn í kerfið. Reyndu aftur síðar eða hafðu samband við Húsnæðis- og mannvirkjastofnun ef þú telur þetta vera villu.',
    description: 'No rental agreement screen description 2',
  },
})
