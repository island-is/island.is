import React, { useState } from 'react'
import TestRenderer, { act } from 'react-test-renderer'

import { FormRenderer } from './FormRenderer'
import type { SdfComponentData } from '../lib/graphql'

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  GridColumn: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  GridRow: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Input: (props: Record<string, unknown>) => <input {...props} />,
  Text: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
}))

jest.mock('@island.is/shared/form-fields', () => ({
  FieldDescription: ({ description }: { description?: string }) => (
    <div>{description}</div>
  ),
}))

const numberFormatProps: Array<Record<string, unknown>> = []

jest.mock('react-number-format', () => ({
  __esModule: true,
  default: ({
    customInput: CustomInput,
    value,
    suffix,
    ...props
  }: {
    customInput: React.ComponentType<Record<string, unknown>>
    value: string
    suffix?: string
  }) => {
    numberFormatProps.push({ ...props, value, suffix })
    return <CustomInput {...props} value={suffix ? `${value}${suffix}` : value} />
  },
}))

const components: SdfComponentData[] = [
  {
    __typename: 'SdfTextField',
    id: 'input1',
    label: 'Input 1',
    inputVariant: 'currency',
    width: 'HALF',
  },
  {
    __typename: 'SdfTextField',
    id: 'input2',
    label: 'Input 2',
    inputVariant: 'currency',
    width: 'HALF',
  },
  {
    __typename: 'SdfTextField',
    id: 'input3',
    label: 'Input 3',
    inputVariant: 'currency',
    width: 'HALF',
  },
  {
    __typename: 'SdfDisplayField',
    id: 'displayField',
    label: 'Display Field',
    inputVariant: 'currency',
    clientValueExpression: {
      operator: 'SUM',
      args: [
        { operator: 'GET', args: ['input1'] },
        { operator: 'GET', args: ['input2'] },
        { operator: 'GET', args: ['input3'] },
      ],
    },
  },
]

const Harness = () => {
  const [answers, setAnswers] = useState<Record<string, unknown>>({})

  return (
    <FormRenderer
      components={components}
      errors={[]}
      answers={answers}
      onAnswerChange={(fieldId, value) =>
        setAnswers((current) => ({ ...current, [fieldId]: value }))
      }
    />
  )
}

describe('FormRenderer client display fields', () => {
  beforeEach(() => {
    numberFormatProps.length = 0
    jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('updates a display field immediately from typed currency answers', () => {
    const renderer = TestRenderer.create(<Harness />)

    expect(renderer.root.findAllByType('input')[3].props.value).toBe('0 kr.')

    act(() => {
      ;(numberFormatProps[0].onValueChange as (values: { value: string }) => void)(
        {
          value: '23',
        },
      )
      ;(numberFormatProps[1].onValueChange as (values: { value: string }) => void)(
        {
          value: '34',
        },
      )
      ;(numberFormatProps[2].onValueChange as (values: { value: string }) => void)(
        {
          value: '23',
        },
      )
    })

    expect(renderer.root.findAllByType('input')[3].props.value).toBe('80 kr.')
  })

  it('warns in development when a display field client expression reads another display field', () => {
    act(() => {
      TestRenderer.create(
        <FormRenderer
          components={[
            ...components,
            {
              __typename: 'SdfDisplayField',
              id: 'displayField2',
              label: 'Display Field 2',
              clientValueExpression: {
                operator: 'MULTIPLY',
                args: [
                  { operator: 'GET', args: ['input1'] },
                  { operator: 'GET', args: ['displayField'] },
                ],
              },
            },
          ]}
          errors={[]}
          answers={{}}
          onAnswerChange={jest.fn()}
        />,
      )
    })

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'displayField2 clientValueExpression depends on display field displayField',
      ),
    )
  })
})
