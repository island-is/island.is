import React from 'react'
import TestRenderer from 'react-test-renderer'

import { SdfDisplayField } from './SdfDisplayField'

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Input: (props: Record<string, unknown>) => <input {...props} />,
  Text: ({ children }: { children?: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

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
  }) => <CustomInput {...props} value={suffix ? `${value}${suffix}` : value} />,
}))

const baseProps = {
  component: {
    __typename: 'SdfDisplayField',
    id: 'displayField',
    label: 'Display Field',
    inputVariant: 'currency',
    rightAlign: true,
    clientValueExpression: {
      operator: 'SUM' as const,
      args: [
        { operator: 'GET' as const, args: ['input1'] },
        { operator: 'GET' as const, args: ['input2'] },
        { operator: 'GET' as const, args: ['input3'] },
      ],
    },
  },
  currentValue: undefined,
  answers: {},
  onAnswerChange: jest.fn(),
  handleChange: jest.fn(),
  pendingRefetchTargets: [],
  isRefetchPending: false,
}

describe('SdfDisplayField', () => {
  it('updates client expression value when answers change', () => {
    const renderer = TestRenderer.create(<SdfDisplayField {...baseProps} />)

    expect(renderer.root.findByType('input').props.value).toBe('0 kr.')

    renderer.update(
      <SdfDisplayField
        {...baseProps}
        answers={{ input1: '23', input2: '34', input3: '23' }}
      />,
    )

    expect(renderer.root.findByType('input').props.value).toBe('80 kr.')
  })
})
