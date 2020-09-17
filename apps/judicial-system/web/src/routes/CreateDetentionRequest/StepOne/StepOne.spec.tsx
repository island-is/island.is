import { createMemoryHistory } from 'history'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import StepOne from './StepOne'
import { Router } from 'react-router-dom'

describe('/stofna-krofu/grunnupplysingar', () => {
  test('should display an empty form if there is nothing in local storage', async () => {
    // Arrange
    const history = createMemoryHistory()
    const { getByTestId, queryAllByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )
    // Object.defineProperty(window.localStorage, 'getItem', {
    //   writable: true,
    //   value: JSON.stringify({ id: '', case: {} }),
    // })

    // Act
    const aa = [
      getByTestId(/policeCaseNumber/i),
      getByTestId(/nationalId/i),
      getByTestId(/suspectName/i),
      getByTestId(/suspectAddress/i),
      getByTestId(/arrestTime/i),
      getByTestId(/courtDate/i),
    ]

    const court = getByTestId(/select-court/i).getElementsByClassName(
      'singleValue',
    )[0].innerHTML

    const datepickers = queryAllByTestId(/datepicker-value/i)

    // Assert
    expect(aa.filter((a) => a.innerHTML !== '').length).toEqual(0)
    expect(court).toEqual('Héraðsdómur Reykjavíkur')
    expect(datepickers.length).toEqual(0)
  })

  test('should persist data if data is in localstorage', async () => {
    // Arrange
    const history = createMemoryHistory()
    const { getByTestId, queryAllByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )

    // Act
    const policeCaseNumber = getByTestId(/policeCaseNumber/i)
    policeCaseNumber.

    // Assert
    // expect(policeCaseNumber).toEqual('x-007-2')
  })
})
