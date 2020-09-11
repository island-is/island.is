import React from 'react'
import { render } from '@testing-library/react'

import {ServiceCard, ServiceCardInformation, ServiceStatusValue} from './service-card'

describe(' ServiceCard ', () => {
  const service:ServiceCardInformation = {
      id        :0,
      name      :"service 1", 
      owner     : "owner of service 1", 
      pricing   :["free", "custom"], 
      data      :["personal"], 
      type      :["GraphQÆ", "REST"],
      access    :null,
      status    :ServiceStatusValue.OK,
      url       :""
    };
  
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceCard service={service}/>)
    expect(baseElement).toBeTruthy()
  })
  describe('Card values should contain', () => {

    it('should contain service name', () => {
      const { getByText } = render(<ServiceCard service={service}/>)
      expect(getByText(service.name)).toBeTruthy()
    })
  
    it('should contain owner name', () => {
      const { getByText } = render(<ServiceCard service={service}/>)
      expect(getByText(service.owner)).toBeTruthy()
    })
  
    it('should contain all pricing values', () => {
      const { getByText } = render(<ServiceCard service={service}/>)
      expect(getByText(service.pricing[0])).toBeTruthy()
      expect(getByText(service.pricing[1])).toBeTruthy()
    })
    it('should contain all categories values', () => {
      const { getByText } = render(<ServiceCard service={service}/>)
      expect(getByText(service.data[0])).toBeTruthy()
    })
    it('should contain all types values', () => {
      const { getByText } = render(<ServiceCard service={service}/>)
      expect(getByText(service.type[0])).toBeTruthy()
      expect(getByText(service.type[1])).toBeTruthy()
    })
  })
})
