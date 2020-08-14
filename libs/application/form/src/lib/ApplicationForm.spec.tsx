import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import * as z from 'zod'

import { ApplicationForm } from './ApplicationForm'
import { buildForm, buildTextField } from '@island.is/application/schema'

describe(' ApplicationForm', () => {
  const exampleForm = buildForm({
    schema: z.object({ text: z.string() }),
    id: '123',
    name: 'Example',
    ownerId: '222',
    children: [
      buildTextField({
        id: 'text',
        name: 'what is your name?',
        required: false,
      }),
    ],
  })
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApplicationForm form={exampleForm} initialAnswers={{}} />,
    )
    expect(baseElement).toBeTruthy()
  })

  it('should render the application title', () => {
    const { getByText } = render(
      <ApplicationForm form={exampleForm} initialAnswers={{}} />,
    )
    expect(getByText(exampleForm.name)).toBeInTheDocument()
  })
})
