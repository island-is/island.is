import React from 'react'
import { render } from '@testing-library/react'

import {ServiceCard, ServiceCardInformation} from '.'

import { ACCESS_CATEGORY, DATA_CATEGORY, PRICING_CATEGORY, TYPE_CATEGORY } from '../ServiceRepository/service-repository';
import { SERVICE_STATUS } from '..';

describe(' ServiceCard ', () => {
  const service:ServiceCardInformation = {
    id:0,
    owner:"Þjóðskrá",
    name:"Fasteignaskrá",
    url:"http://fasteignaskra.thodskra.is:4700",
    status:SERVICE_STATUS.OK,
    pricing:[PRICING_CATEGORY.FREE, PRICING_CATEGORY.CUSTOM],
    data:   [DATA_CATEGORY.PUBLIC],
    type:   [TYPE_CATEGORY.REACT,  TYPE_CATEGORY.SOAP],
    access: [ACCESS_CATEGORY.X_ROAD]
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
    it('should contain all Access values', () => {
      const { getByText } = render(<ServiceCard service={service}/>)
      expect(getByText(service.access[0])).toBeTruthy()
    })
  })
})
