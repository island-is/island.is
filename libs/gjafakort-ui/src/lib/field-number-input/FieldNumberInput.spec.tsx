import React from 'react'
import { Formik, Field } from 'formik'
import { render } from '@testing-library/react'

import FieldNumberInput from './FieldNumberInput'

describe(' FieldNumberInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Formik
        initialValues={{ field: '' }}
        onSubmit={() => {
          // submit
        }}
      >
        <Field name="field" component={FieldNumberInput} />
      </Formik>,
    )
    expect(baseElement).toBeTruthy()
  })
})
