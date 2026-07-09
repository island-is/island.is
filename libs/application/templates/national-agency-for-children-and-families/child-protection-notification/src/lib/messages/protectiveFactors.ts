import { defineMessages } from 'react-intl'

export const protectiveFactorsMessages = {
  shared: defineMessages({
    sectionTitle: {
      id: 'cpn.application:protectiveFactors.shared.sectionTitle',
      defaultMessage: 'Verndandi þættir',
      description: 'Protective factors section title',
    },
    description: {
      id: 'cpn.application:protectiveFactors.shared.description',
      defaultMessage:
        'Allar fjölskyldur og öll börn hafa yfir að búa sterkum hliðum og verndandi þáttum sem stuðla að velferð þeirra og seiglu og geta dregið úr neikvæðum áhrifum áfalla eða álags. \n\nVeist þú hvaða verndandi þætti, ef einhverja, er hægt að nefna í máli barnsins sem um ræðir? Veldu alla þá þætti sem þú hefur vitneskju um og telur vera lýsandi. \n\nEf þú þekkir ekki til verndandi þátta, þá hakarðu einfaldlega við þann möguleika og heldur svo áfram.',
      description: 'Protective factors page description with instructions',
    },
    itemsLabel: {
      id: 'cpn.application:protectiveFactors.shared.itemsLabel',
      defaultMessage: 'Eiginleikar',
      description: 'Label for the sub-category items multi-select',
    },
  }),
  unborn: defineMessages({
    description: {
      id: 'cpn.application:protectiveFactors.unborn.description',
      defaultMessage:
        'Allar fjölskyldur hafa yfir að búa sterkum hliðum og verndandi þáttum sem geta dregið úr hættu og stuðlað að öryggi, heilsu og velferð ófædds barns. \n\nVeist þú hvaða verndandi þætti er hægt að nefna í máli ófædda barnsins sem um ræðir? Veldu alla þá þætti sem þú hefur vitneskju um og telur vera lýsandi.',
      description: 'Protective factors page description for unborn children',
    },
  }),
}
