import { defineMessage } from 'react-intl'

export const selectCourt = {
  title: defineMessage({
    id: 'judicial.system.core:select_court.title',
    defaultMessage: 'Dómstóll',
    description:
      'Notaður sem titill við "Veldu dómstól" fellilistann í öllum málstegundum.',
  }),
  label: defineMessage({
    id: 'judicial.system.core:select_court.label',
    defaultMessage: 'Veldu dómstól',
    description:
      'Notaður sem titill í "Veldu dómstól" fellilistanum í öllum málstegundum.',
  }),
  placeholder: defineMessage({
    id: 'judicial.system.core:select_court.placeholder',
    defaultMessage: 'Veldu dómstól',
    description:
      'Notaður sem lýsitexti í "Veldu dómstól" fellilistanum í öllum málstegundum.',
  }),
}
