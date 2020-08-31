import React from 'react'
import fetchMock from 'fetch-mock'
import { render, waitFor } from '@testing-library/react'
import { DetentionRequests } from './'

const mockDetensionRequests = [
  {
    id: 'fbad84cc-9cab-4145-bf8e-ac58cc9c2790',
    state: 'DRAFT',
    description: 'Test case',
    policeCaseNumber: '007-2020-X',
    suspectNationalId: '150689-5989',
    suspectName: 'Katrín Erlingsdóttir',
    modified: '2020-08-31T10:47:35.565Z',
    created: '2020-08-31T10:47:35.565Z',
  },
  {
    id: 'fbad84cc-9cab-4145-bf8e-ac58cc9c2790',
    state: 'SUBMITTED',
    description: 'Test case 2',
    policeCaseNumber: '008-2020-X',
    suspectNationalId: '012345-6789',
    suspectName: 'Erlingur Kristinsson',
    modified: '2020-08-31T10:47:35.565Z',
    created: '2020-08-31T10:47:35.565Z',
  },
]

describe('Detention requests route', () => {
  test('should list all cases in a table', async () => {
    fetchMock.get('/api/cases', mockDetensionRequests)
    const { getAllByTestId } = render(<DetentionRequests />)

    await waitFor(() => getAllByTestId('detention-requests-table-row'))

    expect(getAllByTestId('detention-requests-table-row').length).toEqual(
      mockDetensionRequests.length,
    )
  })
})
