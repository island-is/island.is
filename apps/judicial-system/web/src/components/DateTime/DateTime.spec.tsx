import React from 'react'
import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import DateTime from '@island.is/judicial-system-web/src/components/DateTime/DateTime'

describe('DateTime component', () => {
  test('Should return a valid date and time', async () => {
    // const selectedDate = new Date(2021, 3, 24)
    const user = userEvent.setup()
    const onChangeMock = jest.fn()

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <DateTime name="test1" onChange={onChangeMock} />)
      </IntlProvider>,
    )

    await user.click(screen.getByText('Veldu dagsetningu'))

    await user.click(screen.getByText('15'))

    expect(onChangeMock.mock.calls).toEqual([[undefined, false]])

    await user.type(await screen.findByTestId('test1-time'), '13:37')

    const lastMockCall =
      onChangeMock.mock.calls[onChangeMock.mock.calls.length - 1]

    expect(lastMockCall[0].getDate()).toEqual(15)
    expect(lastMockCall[1]).toEqual(true)
  })

  test('Should only change date when date is changed, time stays the same', async () => {
    const selectedDate = new Date(2021, 3, 24, 13, 37)
    const user = userEvent.setup()
    const onChangeMock = jest.fn()

    render(
      <IntlProvider locale="is" onError={jest.fn}>
        <DateTime
          name="test1"
          selectedDate={selectedDate}
          onChange={onChangeMock}
        />
      </IntlProvider>,
    )

    await user.click(screen.getByText('Veldu dagsetningu'))

    await user.click(screen.getByText('15'))

    const lastMockCall =
      onChangeMock.mock.calls[onChangeMock.mock.calls.length - 1]

    const dateToValidate = new Date(selectedDate.getTime())

    dateToValidate.setDate(15)

    expect(lastMockCall[0]).toEqual(dateToValidate)

    expect(lastMockCall[1]).toEqual(true)
  })
})
