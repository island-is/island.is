import { defineMessage, defineMessages } from 'react-intl'

// Strings for select court component
export const requestCourtForm = {
  heading: defineMessage({
    id: 'judicial.system:form.requestCourt.heading',
    defaultMessage: 'Óskir um fyrirtöku',
    description: 'Request court form: Heading',
  }),
  arrestDate: defineMessages({
    heading: {
      id: 'judicial.system:form.requestCourt.arrestDate.heading',
      defaultMessage: 'Tími handtöku',
      description: 'Request court form arrest date: Heading',
    },
  }),
}
