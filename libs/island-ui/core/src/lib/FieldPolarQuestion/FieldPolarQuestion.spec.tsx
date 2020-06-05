import React from 'react'
import { Formik, Field } from 'formik'
import { render } from '@testing-library/react'

import FieldPolarQuestion from './FieldPolarQuestion'

describe(' FieldPolarQuestion', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Formik
        initialValues={{}}
        onSubmit={() => {
          // submit
        }}
      >
        <Field component={FieldPolarQuestion} />
      </Formik>,
    )
    expect(baseElement).toBeTruthy()
  })
})
