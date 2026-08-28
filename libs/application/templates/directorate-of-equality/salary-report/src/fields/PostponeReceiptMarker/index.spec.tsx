import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import {
  ApplicationStatus,
  ApplicationTypes,
  type Application,
  type FieldBaseProps,
} from '@island.is/application/types'
import { PostponeReceiptMarker } from './index'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: (message: unknown) => message }),
}))

const application = (answers: Application['answers'] = {}): Application => ({
  id: 'app-1',
  assignees: [],
  applicantActors: [],
  typeId: ApplicationTypes.SALARY_REPORT,
  externalData: {},
  answers,
  applicant: '0101302989',
  state: 'postponed',
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
  draftFinishedSteps: 4,
  draftTotalSteps: 6,
})

// The exact payload matters: MockedProvider only matches on deep-equal
// variables, so a passing test also pins the draftProgress echo — omitting it
// resets the application card's progress meter server-side.
const writeVariables = {
  input: {
    id: 'app-1',
    answers: { salaryAnalysis: { postponeReceiptSeen: true } },
    draftProgress: { stepsFinished: 4, totalSteps: 6 },
  },
  locale: 'is',
}

const renderMarker = (
  mocks: Parameters<typeof MockedProvider>[0]['mocks'],
  answers: Application['answers'] = {},
) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <PostponeReceiptMarker
        {...({ application: application(answers) } as FieldBaseProps)}
      />
    </MockedProvider>,
  )

describe('PostponeReceiptMarker', () => {
  it('persists the flag once, with the draft progress echoed back', async () => {
    const write = jest.fn(() => ({ data: { updateApplication: null } }))
    const { container } = renderMarker([
      { request: { query: UPDATE_APPLICATION, variables: writeVariables }, result: write },
    ])

    await waitFor(() => expect(write).toHaveBeenCalledTimes(1))
    expect(container.innerHTML).toBe('')
  })

  it('does not write again once the flag is already persisted', async () => {
    const write = jest.fn(() => ({ data: { updateApplication: null } }))
    renderMarker(
      [{ request: { query: UPDATE_APPLICATION, variables: writeVariables }, result: write }],
      { salaryAnalysis: { postponeReceiptSeen: true } },
    )

    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(write).not.toHaveBeenCalled()
  })

  it('retries once when the write fails', async () => {
    const write = jest.fn(() => ({ data: { updateApplication: null } }))
    renderMarker([
      {
        request: { query: UPDATE_APPLICATION, variables: writeVariables },
        error: new Error('network'),
      },
      { request: { query: UPDATE_APPLICATION, variables: writeVariables }, result: write },
    ])

    await waitFor(() => expect(write).toHaveBeenCalledTimes(1))
  })
})
