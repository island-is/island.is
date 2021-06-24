import { defineMessages, defineMessage } from 'react-intl'

// Strings for select court component
export const selectCourt = {
  heading: defineMessage({
    id: 'judicial.system:component.selectCourt.heading',
    defaultMessage: 'Dómstóll',
    description: 'Select court component: Heading',
  }),
  select: defineMessages({
    label: {
      id: 'judicial.system:component.selectCourt.select.label',
      defaultMessage: 'Veldu dómstól',
      description: 'Select court component select: Label',
    },
  }),
}
