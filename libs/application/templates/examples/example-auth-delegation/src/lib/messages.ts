import { defineMessages } from 'react-intl'

export const m = defineMessages({
  delegationDescription: {
    id: 'exad.application:delegationDescription',
    defaultMessage:
      'You are now logged in with an auth delegation for a **{type}**. The applicant is **{name}** ({applicantNationalId}) and the actors that have edited this application are **{actors}**',
    description: 'Auth delegation description',
  },
})
