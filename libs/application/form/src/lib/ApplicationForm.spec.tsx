import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ApplicationForm } from './ApplicationForm'
import { FormType } from '@island.is/application/schema'
import { client } from '@island.is/application/graphql'
import { ApolloProvider } from '@apollo/client'

describe(' ApplicationForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApolloProvider client={client}>
        <ApplicationForm
          formType={FormType.EXAMPLE3}
          initialAnswers={{}}
          loadingApplication={false}
        />
      </ApolloProvider>,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render the application title', () => {
    const { getByText } = render(
      <ApolloProvider client={client}>
        <ApplicationForm
          formType={FormType.EXAMPLE3}
          initialAnswers={{}}
          loadingApplication={false}
        />
      </ApolloProvider>,
    )
    expect(getByText(`Driver's license`)).toBeInTheDocument()
  })
})
