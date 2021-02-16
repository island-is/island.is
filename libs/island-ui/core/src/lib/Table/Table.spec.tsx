import React from 'react'
import { render } from '@testing-library/react'

import * as T from './Table'

describe('Table', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Header</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          <T.Row>
            <T.Data>Data</T.Data>
          </T.Row>
        </T.Body>
        <T.Foot>
          <T.Row>
            <T.Data>Foot</T.Data>
          </T.Row>
        </T.Foot>
      </T.Table>,
    )
    expect(baseElement).toBeTruthy()
  })
})
