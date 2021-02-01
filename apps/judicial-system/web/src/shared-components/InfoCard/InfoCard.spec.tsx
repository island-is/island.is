import InfoCard from './InfoCard'
import React from 'react'
import { render, screen } from '@testing-library/react'

describe('InfoCard', () => {
  test('should display the assigned defender name if that info is provided even though the defender email is not', async () => {
    // Arrange
    render(<InfoCard data={[]} defender={{ name: 'Joe' }} />)

    // Act and Assert
    expect(await screen.findByText('Joe')).toBeTruthy()
  })

  test('should display the assigned defender name and email if that info is provided', async () => {
    // Arrange
    render(
      <InfoCard data={[]} defender={{ name: 'Joe', email: 'joe@joe.is' }} />,
    )

    // Act and Assert
    expect(await screen.findByText('Joe, joe@joe.is')).toBeTruthy()
  })

  test('should display a message saying that a defender has not been set if the defender info is missing', async () => {
    // Arrange
    render(<InfoCard data={[]} />)

    // Act and Assert
    expect(await screen.findByText('Hefur ekki verið skráður')).toBeTruthy()
  })
})
