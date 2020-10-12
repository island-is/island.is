
import React from 'react';
import { render } from '@testing-library/react';

import Layout from './Layout';

describe(' Layout ', () => {

  it('should render successfully', () => {

    const { baseElement } = render(<Layout left={null} />)
    expect(baseElement).toBeTruthy();
  })
})
