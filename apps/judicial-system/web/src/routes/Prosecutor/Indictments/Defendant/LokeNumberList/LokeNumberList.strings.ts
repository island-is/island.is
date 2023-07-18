import { defineMessages } from 'react-intl'

export const lokeNumberList = defineMessages({
  selectAllCheckbox: {
    id: 'judicial.system.core:loke_number_list.select_all_checkbox',
    defaultMessage: 'Velja öll',
    description:
      'Notaður sem titill í hak til að velja öll Velja öll Löke númerin sem er í boði',
  },
  selectNumberButton: {
    id: 'judicial.system.core:loke_number_list.select_number_button',
    defaultMessage: 'Velja númer',
    description:
      'Textin á takkanum sem velur Löke númerið sem er valið í töflunni',
  },
  errorMessage: {
    id: 'judicial.system.core:loke_number_list.error_message',
    defaultMessage: 'Ekki tókst að sækja Löke númer',
    description:
      'Villuskilaboðin sem koma þegar tekst ekki að sækja Löke númerin',
  },
})
