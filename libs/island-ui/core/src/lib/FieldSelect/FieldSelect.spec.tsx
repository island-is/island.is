import React from 'react'
import { Formik, Field } from 'formik'
import { render } from '@testing-library/react'

import FieldSelect from './FieldSelect'

describe('FieldSelect', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Formik
        initialValues={{}}
        onSubmit={() => {
          // submit
        }}
      >
        <Field component={FieldSelect} />
      </Formik>,
    )
    expect(baseElement).toBeTruthy()
  })
})
