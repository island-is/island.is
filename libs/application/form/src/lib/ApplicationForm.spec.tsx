import React from 'react'
import { act, render } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ApplicationForm } from './ApplicationForm'
import { Application, ApplicationTypes } from '@island.is/application/template'
import { client } from '@island.is/application/graphql'
import { ApolloProvider } from '@apollo/client'
import { LocaleProvider } from '@island.is/localization'

describe(' ApplicationForm', () => {
  const applicant = '1111112219'
  const application: Application = {
    id: '12315151515',
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    attachments: {},
    externalData: {},
    answers: {},
    applicant,
    externalId: '123123123',
    state: 'draft',
    modified: new Date(),
    created: new Date(),
  }

  it('should render successfully', async () => {
    let baseElement
    await act(async () => {
      const wrapper = await render(
        <ApolloProvider client={client}>
          <LocaleProvider locale="is" messages={{}}>
            <ApplicationForm
              application={application}
              nationalRegistryId={applicant}
            />
          </LocaleProvider>
        </ApolloProvider>,
      )
      baseElement = wrapper.baseElement
    })
    expect(baseElement).toBeTruthy()
  })

  it('should render the application title', async () => {
    await act(async () => {
      const wrapper = await render(
        <ApolloProvider client={client}>
          <LocaleProvider locale="is" messages={{}}>
            <ApplicationForm
              application={application}
              nationalRegistryId={applicant}
            />
          </LocaleProvider>
        </ApolloProvider>,
      )
      expect(wrapper.getByText(`Fæðingarorlof`)).toBeInTheDocument()
    })
  })
})
