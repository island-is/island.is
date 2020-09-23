import React from 'react'
import { render } from '@testing-library/react'

import Home from '../pages/index'

describe('Home', () => {

  const pageContent = {
    title:"The title",
    introText: "the intro text",
    buttons: [
      {label:"Button1", linkUrl:"http://button1"}
    ]
  }
  
  it('should render successfully', () => {
    const { baseElement } = render(<Home  pageContent={pageContent} />)
    expect(baseElement).toBeTruthy()
  })

  it('should have a greeting as the title', () => {
    const { getByText } = render(<Home pageContent={pageContent}/>)
    expect(getByText(pageContent.title)).toBeTruthy() 
    
  })
})
