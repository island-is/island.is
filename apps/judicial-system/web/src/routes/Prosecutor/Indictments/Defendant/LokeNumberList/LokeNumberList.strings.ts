import { defineMessages } from 'react-intl'

export const lokeNumberList = defineMessages({
  selectAllCheckbox: {
    id: 'judicial.system.core:loke_number_list.select_all_checkbox',
    defaultMessage: 'Velja öll',
    description:
      'Notaður sem titill í hak til að velja öll Velja öll Löke númerin sem er í boði',
  },
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
