
import React from 'react';
import { render } from '@testing-library/react';

import { SERVICE_STATUS, ServiceStatus } from './ServiceStatus';

describe(' ServiceStatus ', () => {

  it('should render successfully', () => {

    const { baseElement } = render(<ServiceStatus status={SERVICE_STATUS.OK}/>)
    expect(baseElement).toBeTruthy();
  })
})
