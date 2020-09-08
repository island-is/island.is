import React from 'react'
import { render } from '@testing-library/react'

import Index from '../pages/index'

describe('Index', () => {
  const cards = [
    { title: "Services", slug: "/services" },
    { title: "Data Models", slug: "/data-models" },
    { title: "API Design Guide", slug: "/design-guide" }
  ];
  
  it('should render successfully', () => {
    const { baseElement } = render(<Index cards={cards} />)
    expect(baseElement).toBeTruthy()
  })

  it('should have a greeting as the title', () => {
    const { getByText } = render(<Index cards={cards}/>)
    expect(getByText('Viskuausan')).toBeTruthy() 
    
  })
})
