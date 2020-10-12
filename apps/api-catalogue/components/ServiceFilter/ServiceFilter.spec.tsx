
import React from 'react';
import { render } from '@testing-library/react';

import { ServiceFilter } from './ServiceFilter';

describe(' ServiceFilter ', () => {

  it('should render successfully', () => {

    const { baseElement } = render(
    <ServiceFilter
      iconVariant="default"
      rootClasses={null}
      isLoading={true}
      parameters={null}
      onInputChange={null}
      onClear={null}
      onCheckCategoryChanged={null}
      strings={null}
    />
       )
    expect(baseElement).toBeTruthy();
  })
})
