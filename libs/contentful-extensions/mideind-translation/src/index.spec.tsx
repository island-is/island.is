/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react'
import { render, fireEvent, cleanup, configure } from '@testing-library/react'
import { DialogExtension, SidebarExtension } from './index'

configure({
  testIdAttribute: 'data-test-id',
})

describe('DialogExtension', () => {
  afterEach(cleanup)

  it('renders button', () => {
    const sdk: any = {
      close: jest.fn(),
    }
    const { getByTestId } = render(<DialogExtension sdk={sdk} />)

    fireEvent.click(getByTestId('close-dialog'))
    expect(sdk.close).toHaveBeenCalledWith('data from modal dialog')
  })
})

describe('SidebarExtension', () => {
  afterEach(cleanup)

  it('render button', () => {
    const sdk: any = {
      window: {
        startAutoResizer: jest.fn(),
      },
      dialogs: {
        openExtension: jest.fn(),
      },
    }
    const { getByTestId } = render(<SidebarExtension sdk={sdk} />)

    expect(sdk.window.startAutoResizer).toHaveBeenCalled()

    fireEvent.click(getByTestId('open-dialog'))

    expect(sdk.dialogs.openExtension).toHaveBeenCalledWith({
      title: 'The same extension rendered in modal window',
      width: 800,
    })
  })
})
