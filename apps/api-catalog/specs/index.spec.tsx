import React from 'react'
import { render } from '@testing-library/react'

import Home from '../pages/index'
import { Page } from '../services/contentful.types'

describe('Home', () => {

  const pageContent:Page = {
    id: 'home',
    strings: [
      { id: 'home-title', text: 'Viskuausan' },
      {
        id: 'home-intro',
        text: 'Hér getur þú skoðað og leitað í fjölda vefþjónusta og gagnaskilgreininga hjá hinu opinbera'
      },
      { id: 'home-catalog-button', text: 'API Vörulisti' },
      { id: 'home-dm-button', text: 'Gagnamódel' },
      { id: 'home-dg-button', text: 'Þróunarhandbók' },
      {
        id: 'home-cata-btn-txt',
        text: 'Skoða og leita í fjölda vefþjónusta hjá hinu opinbera.'
      },
      {
        id: 'home-dg-btn-txt',
        text: 'Skoða þróunarhandbók Stafræns Íslands. Bókin er leiðarvísir um bestu vinnubrögð við þróun vefþjónusta.'
      },
      {
        id: 'home-dm-btn-txt',
        text: 'Skoða og leita í fjölda gagnaskilgreininga hjá hinu opinbera.'
      }
    ]
  }
  
  it('should render successfully', () => {
    const { baseElement } = render(<Home  pageContent={pageContent} />)
    expect(baseElement).toBeTruthy()
  })

  it('should have a greeting as the title', () => {
    const { getByText } = render(<Home pageContent={pageContent}/>)
    expect(getByText(pageContent.strings[0].text)).toBeTruthy() 
    
  })
})
