import React from 'react'
import { render } from '@testing-library/react'

import { DesignGuide } from './DesignGuide'
import { Page } from '../../services/contentful.types'

describe(' DesignGuide ', () => {
  
  const pageContent : Page = {
    id: 'design-guide',
    strings: [
      { id: 'dg-title', text: 'Þróunarhandbók' },
      {
        id: 'dg-intro',
        text: 'Hér getur þú skoðað Þróunarhandbókina, sem er útgefin af Stafrænu Íslandi. Handbókin er hugsuð sem leiðarvísir um góð vinnubrögð við þróun vefþjónusta.'
      },
      {
        id: 'dg-body',
        text: 'Þessi handbók á að hjálpa til við að samhæfa vinnu milli forritara og auðvelda samstarf. Farið er yfir viðeigandi hönnunarviðmið og mynstur sem nota skal svo notendaupplifunin sé ánægjuleg og sambærileg milli vefþjónusta.\n' +
          '\n' +
          'Handbókin er í sífelldri endurskoðun og verður uppfærð með tímanum þegar ný hönnunarmynstur og stílar eru tekin upp.'
      },
      { id: 'dg-view-button', text: 'Skoða Þróunarhandbókina á GitHub' },
      {
        id: 'dg-view-button-href',
        text: 'https://github.com/island-is/handbook'
      }
    ]
  }

  it('should render successfully', async () => {
    
    const { baseElement } = render(<DesignGuide pageContent={pageContent} />)
    expect(baseElement).toBeTruthy()
  })
})
