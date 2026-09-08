import React from 'react'
import TestRenderer from 'react-test-renderer'

import { SdfTextField } from './SdfTextField'

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Input: (props: Record<string, unknown>) => <input {...props} />,
}))

const numberFormatProps: Array<Record<string, unknown>> = []

jest.mock('react-number-format', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    numberFormatProps.push(props)
    return <input value={String(props.value ?? '')} readOnly />
  },
}))

describe('SdfTextField', () => {
  beforeEach(() => {
    numberFormatProps.length = 0
  })

  it('publishes raw numeric values from currency input changes', () => {
    const handleChange = jest.fn()

    TestRenderer.create(
      <SdfTextField
        component={{
          __typename: 'SdfTextField',
          id: 'input1',
          label: 'Input 1',
          inputVariant: 'currency',
        }}
        currentValue=""
        answers={{}}
        onAnswerChange={jest.fn()}
        handleChange={handleChange}
        pendingRefetchTargets={[]}
        isRefetchPending={false}
      />,
    )

    const onValueChange = numberFormatProps[0].onValueChange as
      | ((values: { value: string }) => void)
      | undefined

    onValueChange?.({ value: '23' })

    expect(handleChange).toHaveBeenCalledWith('23')
  })
})
