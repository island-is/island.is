
import React from 'react';
import { render } from '@testing-library/react';

import { ServiceSection } from './ServiceSection';

import { ServiceDetails } from '../ServiceRepository/ServiceRepository';
import { SERVICE_STATUS } from '../ServiceStatus';



describe(' ServiceSection ', () => {

  const service: ServiceDetails = {
    id: 'test-id',
    name: 'Test name',
    description: 'Test description',
    owner: 'Test owner',
    url: 'test.url',
    pricing: ['test', 'pricing'],
    data: ['test', 'data'],
    type: ['test', 'type'],
    access: ['test', 'access'],
    status: SERVICE_STATUS.OK
  };

  it('should render successfully', () => {

    const { baseElement } = render(<ServiceSection service={service} />)
    expect(baseElement).toBeTruthy();
  })
})
