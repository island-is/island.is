/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { App } from './index';
import { render, fireEvent, cleanup, configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id'
});

function renderComponent(sdk: FieldExtensionSDK) {
  return render(<App sdk={sdk} />);
}

const sdk: any = {
  field: {
    getValue: jest.fn(),
    onValueChanged: jest.fn(),
    setValue: jest.fn(),
    removeValue: jest.fn()
  },
  window: {
    startAutoResizer: jest.fn()
  }
};

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it('should read a value from field.getValue() and subscribe for external changes', () => {
    sdk.field.getValue.mockImplementation(() => 'initial-value');
    const { getByTestId } = renderComponent(sdk);

    expect(sdk.field.getValue).toHaveBeenCalled();
    expect(sdk.field.onValueChanged).toHaveBeenCalled();
    expect((getByTestId('my-field') as HTMLInputElement).value).toEqual('initial-value');
  });

  it('should call starstartAutoResizer', () => {
    renderComponent(sdk);
    expect(sdk.window.startAutoResizer).toHaveBeenCalled();
  });

  it('should call setValue on every change in input and removeValue when input gets empty', () => {
    const { getByTestId } = renderComponent(sdk);

    fireEvent.change(getByTestId('my-field'), {
      target: { value: 'new-value' }
    });

    expect(sdk.field.setValue).toHaveBeenCalledWith('new-value');

    fireEvent.change(getByTestId('my-field'), {
      target: { value: '' }
    });

    expect(sdk.field.setValue).toHaveBeenCalledTimes(1);
    expect(sdk.field.removeValue).toHaveBeenCalledTimes(1);
  });
});
