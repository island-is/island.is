import React from 'react'
import { render, screen } from '@testing-library/react'
import AppealSection from './AppealSection'
import { CaseGender } from '@island.is/judicial-system/types'

describe('Appeal section component', () => {
  test('should say when a case is no longer appealable', async () => {
    // Arrange
    render(
      <AppealSection
        rulingDate="2020-09-16T19:50:08.033Z"
        accusedGender={CaseGender.MALE}
      />,
    )

    // Assert

    expect(
      await screen.findByText(
        'Kærufrestur rennur út 19. september 2020 kl. 19:50',
      ),
    ).toBeInTheDocument()
  })
})
