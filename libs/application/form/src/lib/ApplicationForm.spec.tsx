import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ApplicationForm } from './ApplicationForm'
import { Application, ApplicationTypes } from '@island.is/application/template'
import { client } from '@island.is/application/graphql'
import { ApolloProvider } from '@apollo/client'

describe(' ApplicationForm', () => {
  const application: Application = {
    id: '12315151515',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    attachments: {},
    externalData: {},
    answers: {},
    applicant: '123123',
    externalId: '123123123',
    state: 'draft',
    modified: null,
    created: null,
  }

  it('should render successfully', () => {
    const { baseElement } = render(
      <ApolloProvider client={client}>
        <ApplicationForm application={application} />
      </ApolloProvider>,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render the application title', () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <ApplicationForm application={application} />
      </ApolloProvider>,
    )
    expect(getByText(`Fæðingarorlof`)).toBeInTheDocument()
  })
})
