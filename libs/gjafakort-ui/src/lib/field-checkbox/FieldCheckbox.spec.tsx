import React from 'react'
import { Formik, Field } from 'formik'
import { render } from '@testing-library/react'

import FieldCheckbox from './FieldCheckbox'

describe(' FieldCheckbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Formik
        initialValues={{}}
        onSubmit={() => {
          // submit
        }}
      >
        <Field component={FieldCheckbox} />
      </Formik>,
    )
    expect(baseElement).toBeTruthy()
  })
})
