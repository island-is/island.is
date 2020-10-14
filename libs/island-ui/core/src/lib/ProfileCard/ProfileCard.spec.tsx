import React from 'react'
import { render } from '@testing-library/react'

import { ProfileCard } from './ProfileCard'

describe(' ProfileCard', () => {
  it('should render successfully without props', () => {
    const { baseElement } = render(<ProfileCard />)
    expect(baseElement).toBeTruthy()
  })
  it('should render successfully with all props', () => {
    const { baseElement } = render(
      <ProfileCard
        title="Persons name"
        description="Maybe a job title"
        image="https://www.stevensegallery.com/277/220"
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
