
import React from 'react';
import { render } from '@testing-library/react';

import { InputSearch } from './InputSearch';

describe(' InputSearch ', () => {

  it('should render successfully', () => {

    const { baseElement } = render(<InputSearch name='Test search'/>)
    expect(baseElement).toBeTruthy();
  })
})
