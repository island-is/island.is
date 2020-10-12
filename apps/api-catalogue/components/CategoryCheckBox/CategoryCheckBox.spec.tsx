
import React from 'react';
import { render } from '@testing-library/react';

import CategoryCheckBox from './CategoryCheckBox';

describe(' CategoryCheckBox ', () => {

  it('should render successfully', () => {

    const { baseElement } = render(<CategoryCheckBox checked={false} label='Test' name='Test' value='test' />)
    expect(baseElement).toBeTruthy();
  })
})
