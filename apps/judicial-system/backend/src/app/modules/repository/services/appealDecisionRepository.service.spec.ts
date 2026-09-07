import { Transaction } from 'sequelize'

import { AppealDecisionPartyRole } from '@island.is/judicial-system/types'

import { AppealDecision } from '../models/appealDecision.model'
import { AppealDecisionRepositoryService } from './appealDecisionRepository.service'

describe('AppealDecisionRepositoryService - upsert', () => {
  const transaction = {} as Transaction
  let mockUpsert: jest.Mock
  let service: AppealDecisionRepositoryService

  beforeEach(() => {
    mockUpsert = jest.fn().mockResolvedValue([{ id: 'decision-id' }, true])
    const model = { upsert: mockUpsert } as unknown as typeof AppealDecision
    const logger = {
      debug: jest.fn(),
      error: jest.fn(),
    } as unknown as ConstructorParameters<
      typeof AppealDecisionRepositoryService
    >[1]

    service = new AppealDecisionRepositoryService(model, logger)
  })

  it('targets the snake_case unique-index columns in ON CONFLICT', async () => {
    await service.upsert(
      {
        caseId: 'case-id',
        rulingFileId: 'ruling-file-id',
        partyRole: AppealDecisionPartyRole.DEFENDANT,
        defendantId: 'defendant-id',
      },
      { decision: null, announcement: null },
      { transaction },
    )

    // conflictFields are emitted verbatim into ON CONFLICT (...), so they must
    // be the DB column names. camelCase would fail at runtime.
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        conflictFields: [
          'case_id',
          'ruling_file_id',
          'party_role',
          'defendant_id',
          'civil_claimant_id',
        ],
      }),
    )
  })
})
