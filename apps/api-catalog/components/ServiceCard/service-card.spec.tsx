import React from 'react'
import { render } from '@testing-library/react'

import {ServiceCard, ServiceCardInformation} from './service-card'

describe(' ServiceCard', () => {
  it('should render successfully', () => {
    const service:ServiceCardInformation = {
      name :"service 1", 
      owner: "owner of service 1", 
      pricing   :null, 
      categories:null, 
      type      :null
    };
    const { baseElement } = render(<ServiceCard service={service}/>)
    expect(baseElement).toBeTruthy()
    console.log()
  })
})
