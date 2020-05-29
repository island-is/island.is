import React from 'react'
import { render } from '@testing-library/react'

import VideoIframe from './VideoIframe'

describe(' VideoIframe', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VideoIframe
        src="https://www.youtube.com/embed/JqV0zeeyu9s"
        title="test"
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
