import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { z } from 'zod'

import { ApolloProvider } from '@apollo/client'
import { buildDescriptionField, buildForm } from '@island.is/application/core'
import { client } from '@island.is/application/graphql'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  Form,
} from '@island.is/application/types'
import { LocaleProvider } from '@island.is/localization'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { FormShell } from './FormShell'

describe(' FormShell', () => {
  const applicant = '1111112219'
  const application: Application = {
    id: '12315151515',
    assignees: [],
    typeId: ApplicationTypes.PARENTAL_LEAVE,
    externalData: {},
    answers: {},
    applicant,
    state: 'draft',
    modified: new Date(),
    created: new Date(),
    status: ApplicationStatus.IN_PROGRESS,
    applicantActors: [],
  }
  const form: Form = buildForm({
    id: 'ParentalLeaveForm',
    title: 'Umsókn um fæðingarorlof',
    children: [
      buildDescriptionField({
        id: 'intro',
        title: 'velkomin',
        description: 'This is an awesome application',
      }),
    ],
  })

  const routes = [
    {
      path: '/',
      element: (
        <FormShell
          application={application}
          dataSchema={z.object({})}
          form={form}
          nationalRegistryId={applicant}
        />
      ),
    },
  ]

  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  })

  it('should render successfully', async () => {
    let baseElement

    const wrapper = await render(
      <ApolloProvider client={client}>
        <LocaleProvider locale="is" messages={{}}>
          <RouterProvider router={router} />
        </LocaleProvider>
      </ApolloProvider>,
    )

    await act(async () => {
      baseElement = wrapper.baseElement
    })

    expect(baseElement).toBeTruthy()
  })

  it('should render the application title', async () => {
    await act(async () => {
      render(
        <ApolloProvider client={client}>
          <LocaleProvider locale="is" messages={{}}>
            <RouterProvider router={router} />
          </LocaleProvider>
        </ApolloProvider>,
      )
    })

    expect(
      await screen.findByText(`Umsókn um fæðingarorlof`),
    ).toBeInTheDocument()
  })
})
