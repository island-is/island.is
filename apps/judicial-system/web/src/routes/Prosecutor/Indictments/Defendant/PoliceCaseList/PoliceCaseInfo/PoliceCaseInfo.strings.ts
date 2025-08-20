import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  selectNumbersButton: {
    id: 'judicial.system.core:loke_number_list.select_numbers_button',
    defaultMessage: 'Velja númer',
    description:
      'Textin á takkanum sem velur Löke númerin sem eru valin í töflunni',
  },
  allNumbersSelected: {
    id: 'judicial.system.core:loke_number_list.all_numbers_selected',
    defaultMessage: 'Öll númer hafa verið valin',
    description: 'Textinn sem kemur þegar öll númer hafa verið valin',
  },
  errorMessage: {
    id: 'judicial.system.core:loke_number_list.error_message',
    defaultMessage: 'Ekki tókst að sækja Löke númer',
    description:
      'Villuskilaboðin sem koma þegar tekst ekki að sækja Löke númerin',
  },
})
