
import React from 'react';
import { render } from '@testing-library/react';

import { ServiceCardMessage } from './ServiceCardMessage';

describe(' ServiceCardMessage ', () => {

  it('should render successfully', () => {

    const { baseElement } = render(<ServiceCardMessage title='Test title' />)
    expect(baseElement).toBeTruthy();
  })
})
