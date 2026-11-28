import React from 'react'
import { render } from '@testing-library/react'

import { CustomComponentRenderer } from './CustomComponentRenderer'
import { ALLOWED_CUSTOM_COMPONENT_NAMES } from '../registry'

// Only the lookup of the component is replaced, so the write allowlist the
// renderer consults is the real one.
const mockReceivedProps: Array<Record<string, unknown>> = []

jest.mock('../registry', () => ({
  ...jest.requireActual('../registry'),
  getCustomComponent: () => ({
    component: (props: Record<string, unknown>) => {
      mockReceivedProps.push(props)
      return null
    },
  }),
}))

const renderComponent = (componentName: string) => {
  const onAnswerChange = jest.fn()

  render(
    <CustomComponentRenderer
      componentName={componentName}
      id="field"
      rawProps="{}"
      onAnswerChange={onAnswerChange}
    />,
  )

  return { onAnswerChange, props: mockReceivedProps[0] }
}

describe('CustomComponentRenderer', () => {
  beforeEach(() => {
    mockReceivedProps.length = 0
  })

  it('gives a component that is not on the write allowlist no way to write answers', () => {
    const { props } = renderComponent('NotOnTheAllowlist')

    expect(props.onAnswerChange).toBeUndefined()
  })

  it('gives an allowlisted component the callback that sends answers to the server', () => {
    ALLOWED_CUSTOM_COMPONENT_NAMES.add('OnTheAllowlist')

    try {
      const { props, onAnswerChange } = renderComponent('OnTheAllowlist')

      expect(props.onAnswerChange).toBe(onAnswerChange)
    } finally {
      ALLOWED_CUSTOM_COMPONENT_NAMES.delete('OnTheAllowlist')
    }
  })

  it('passes the server-resolved id and the parsed props to the component', () => {
    const onAnswerChange = jest.fn()

    render(
      <CustomComponentRenderer
        componentName="Anything"
        id="resolved-id"
        rawProps={JSON.stringify({ maxDays: 5 })}
        onAnswerChange={onAnswerChange}
      />,
    )

    expect(mockReceivedProps[0]).toMatchObject({
      id: 'resolved-id',
      maxDays: 5,
    })
  })
})
