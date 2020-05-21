import React from 'react'
import { Formik, Field } from 'formik'
import { render } from '@testing-library/react'

import FieldInput from './FieldInput'

describe(' FieldInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Formik
        initialValues={{}}
        onSubmit={() => {
          // submit
        }}
      >
        <Field component={FieldInput} />
      </Formik>,
    )
    expect(baseElement).toBeTruthy()
  })
})
