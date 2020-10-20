import React from 'react'
import { render } from '@testing-library/react'

import { SideMenu } from './SideMenu'

describe(' SideMenu ', () => {

  it('should render successfully', () => {
    
    const { baseElement } = render(
      <SideMenu
        isVisible={true}
        handleClose={null}
        title="Viskuausan"
        links={[
          { title: 'Upphafsíða', url: '/' },
          { title: 'API Vörulisti', url: '/services' },
          { title: 'Þróunarhandbók', url: '/design-guide' },
          { title: 'Island.is', url: 'https://island.is' },
        ]}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
