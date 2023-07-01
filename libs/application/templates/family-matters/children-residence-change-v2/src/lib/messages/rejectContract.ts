import { defineMessages } from 'react-intl'

export const rejectContract = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.rejectContract.general.sectionTitle',
      defaultMessage: 'Hafna samningi',
      description: 'Reject contract section title',
    },
    pageTitle: {
      id: 'crc.application:section.rejectContract.general.pageTitle',
      defaultMessage: 'Hafna samningi',
      description: 'Reject contract title',
    },
    description: {
      id: 'crc.application:section.rejectContract.general.subTitle#markdown',
      defaultMessage:
        'Þú hefur ákveðið að hafna drögum að samningi um breytt lögheimili sem __{otherParentName}__ hefur undirritað. Ef þú heldur áfram mun __{otherParentName}__ fá tilkynningu í tölvupósti um að samningnum hafi verið hafnað.',
      description: 'Reject contract subtitle',
    },
    rejectButton: {
      id: 'crc.application:section.rejectContract.general.rejectButton',
      defaultMessage: 'Hafna samningi.',
      description: 'Reject contract button',
    },
  }),
  conciliation: defineMessages({
    title: {
      id: 'crc.application:section.rejectContract.conciliation.title',
      defaultMessage: 'Sáttameðferð sýslumanns',
      description: 'Conciliation title',
    },
    description: {
      id: 'crc.application:section.rejectContract.conciliation.description#markdown',
      defaultMessage:
        '- Ef foreldar eru ekki sammála um flutning verður aðeins leyst úr þeim ágreiningi fyrir dómi.\\n\\n - Áður en málið fer fyrir dóm reynir sýslumaður sáttameðferð þar sem þið koma í viðtal til sýslumanns og vinna að mögulegri sáttameðferð í málinu.\\n\\n - Markmið sáttameðferðar er að hjálpa foreldrum að gera samning um þá lausn máls sem er barni fyrir bestu.\\n\\n - Ef sætti skila ekki árangri í sáttameðferð mun málið fara fyrir dóm.',
      description: 'Conciliation description',
    },
  }),
}
