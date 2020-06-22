import React from 'react'
import { Formik, Field } from 'formik'
import { render } from '@testing-library/react'

import FieldRadioButton from './FieldRadioButton'

describe(' FieldRadioButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Formik
        initialValues={{}}
        onSubmit={() => {
          // submit
        }}
      >
        <Field component={FieldRadioButton} />
      </Formik>,
    )
    expect(baseElement).toBeTruthy()
  })
})
