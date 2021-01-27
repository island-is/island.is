import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import CustodyProvisionsSection from './CustodyProvisionsSection'
import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'

describe('CustodyProvisionsSection', () => {
  test('should show all custody provisions if the case is a detention request', async () => {
    // Arrange
    const wc: Case = {
      id: '123',
      created: '2020-09-16T19:51:28.224Z',
      modified: '2020-09-16T19:51:28.224Z',
      state: CaseState.ACCEPTED,
      policeCaseNumber: '123',
      accusedNationalId: '000000-0000',
      // TODO: REPLACE
      comments: CaseType.DETENTION, //caseType: CaseType.DETENTION
    }
    render(
      <CustodyProvisionsSection
        workingCase={wc}
        setWorkingCase={() => null}
        updateCase={() =>
          new Promise(() => {
            return null
          })
        }
      />,
    )

    // Act and Assert
    expect(
      await waitFor(() =>
        screen.getByRole('checkbox', { name: 'a-lið 1. mgr. 95. gr.' }),
      ),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: 'b-lið 1. mgr. 95. gr.' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: 'c-lið 1. mgr. 95. gr.' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: 'd-lið 1. mgr. 95. gr.' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: '2. mgr. 95. gr.' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: 'b-lið 1. mgr. 99. gr.' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: '1. mgr. 100. gr.' }),
    ).toBeTruthy()
  })

  test('should show selected custodyProvisions if the case is a travel ban request', async () => {
    // Arrange
    const wc: Case = {
      id: '123',
      created: '2020-09-16T19:51:28.224Z',
      modified: '2020-09-16T19:51:28.224Z',
      state: CaseState.ACCEPTED,
      policeCaseNumber: '123',
      accusedNationalId: '000000-0000',
      // TODO: REPLACE
      comments: CaseType.TRAVEL_BAN, //caseType: CaseType.DETENTION
    }
    render(
      <CustodyProvisionsSection
        workingCase={wc}
        setWorkingCase={() => null}
        updateCase={() =>
          new Promise(() => {
            return null
          })
        }
      />,
    )

    // Act and Assert
    expect(
      await waitFor(() =>
        screen.getByRole('checkbox', { name: 'a-lið 1. mgr. 95. gr.' }),
      ),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: 'b-lið 1. mgr. 95. gr.' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('checkbox', { name: '1. mgr. 100. gr.' }),
    ).toBeTruthy()
  })
})
