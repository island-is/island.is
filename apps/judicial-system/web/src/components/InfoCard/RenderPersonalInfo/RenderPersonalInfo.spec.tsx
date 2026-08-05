import { render, screen } from '@testing-library/react'

import RenderPersonalData from './RenderPersonalInfo'

describe('RenderPersonalInfo', () => {
  test('should render a name if a name is provided', async () => {
    // Arrange
    const name = 'Joe'

    // Act
    render(RenderPersonalData({ name }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(/^Joe$/)
  })

  test('should render a name and email if they are provided', async () => {
    // Arrange
    const name = 'Joe'
    const email = 'joe@smo.is'
    const phoneNumber = null
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(
      /^Joe, joe@smo.is$/,
    )
  })

  test('should render a name, email and phonenumber if they are provided', async () => {
    // Arrange
    const name = 'Joe'
    const email = 'joe@smo.is'
    const phoneNumber = '111-1111'
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(
      /^Joe, joe@smo.is, s. 111-1111$/,
    )
  })

  test('should render a name and phonenumber if they are provided', async () => {
    // Arrange
    const name = 'Joe'
    const email = null
    const phoneNumber = '111-1111'
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(
      /^Joe, s. 111-1111$/,
    )
  })

  test('should render a email and phonenumber if they are provided', async () => {
    // Arrange
    const name = null
    const email = 'joe@smo.is'
    const phoneNumber = '111-1111'
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(
      /^joe@smo.is, s. 111-1111$/,
    )
  })

  test('should render a name only', async () => {
    // Arrange
    const name = 'Joe'
    const email = null
    const phoneNumber = null
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(/^Joe$/)
  })

  test('should render a email only', async () => {
    // Arrange
    const name = null
    const email = 'joe@smo.is'
    const phoneNumber = null
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(
      /^joe@smo.is$/,
    )
  })

  test('should render a phonenumber only', async () => {
    // Arrange
    const name = null
    const email = null
    const phoneNumber = '111-1111'
    const breakSpaces = false

    // Act
    render(RenderPersonalData({ name, email, phoneNumber, breakSpaces }))

    // Assert
    expect(await screen.findByTestId('personalInfo')).toHaveTextContent(
      /^s. 111-1111$/,
    )
  })

  test('should give the edit button a descriptive accessible name', async () => {
    // Arrange
    const name = 'Joe'

    // Act
    render(RenderPersonalData({ name, onClick: jest.fn() }))

    // Assert
    expect(
      await screen.findByRole('button', { name: 'Breyta Joe' }),
    ).toBeInTheDocument()
  })
})
