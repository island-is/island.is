import React from 'react'
import { render, screen } from '@testing-library/react'
import AppealSection from './AppealSection'
import { CaseGender } from '@island.is/judicial-system/types'

describe('Appeal section component', () => {
  test('should say when a case is no longer appealable', async () => {
    render(
      <AppealSection
        rulingDate="2020-09-16T19:50:08.033Z"
        accusedGender={CaseGender.MALE}
        accusedCanAppeal
        prosecutorCanAppeal
      />,
    )

    expect(
      await screen.findByText(
        'Kærufrestur rennur út 19. september 2020 kl. 19:50',
      ),
    ).toBeInTheDocument()
  })

  test('should not show the "Accused appeals" button if the accused cannot appeal', async () => {
    render(
      <AppealSection
        rulingDate="2020-09-16T19:50:08.033Z"
        accusedGender={CaseGender.MALE}
        accusedCanAppeal={false}
        prosecutorCanAppeal
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Kærði kærir úrskurðinn' }),
    ).not.toBeInTheDocument()
  })

  test('should not show the "Prosecutor appeals" button if the prosecutor cannot appeal', async () => {
    render(
      <AppealSection
        rulingDate="2020-09-16T19:50:08.033Z"
        accusedGender={CaseGender.MALE}
        accusedCanAppeal
        prosecutorCanAppeal={false}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Sækjandi kærir úrskurðinn' }),
    ).not.toBeInTheDocument()
  })
})
