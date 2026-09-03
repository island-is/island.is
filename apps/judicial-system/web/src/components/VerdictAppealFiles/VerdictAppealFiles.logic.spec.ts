import type {
  Case,
  CaseFile,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseFileCategory,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockUser } from '@island.is/judicial-system-web/src/utils/mocks'

import { getVerdictAppealFileGroups } from './VerdictAppealFiles.logic'

describe('getVerdictAppealFileGroups', () => {
  const defenderNationalId = '1111111111'
  const user = {
    id: 'user_id',
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  const file = (
    id: string,
    defendantId: string,
    category: CaseFileCategory,
    created: string,
  ): CaseFile => ({ id, defendantId, category, created, name: `${id}.pdf` })

  const theCase = (caseFiles: CaseFile[]): Case =>
    ({
      id: 'case_id',
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: 'own_client_id',
          name: 'Eigin sakborningur',
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
        {
          id: 'other_client_id',
          name: 'Annar sakborningur',
          isDefenderChoiceConfirmed: true,
          defenderNationalId: '2222222222',
        },
      ],
      caseFiles,
    } as Case)

  it('should return nothing when no declaration has been filed', () => {
    expect(
      getVerdictAppealFileGroups(
        theCase([
          file(
            'a',
            'own_client_id',
            CaseFileCategory.DEFENDANT_CASE_FILE,
            '2026-06-04T13:34:00.000Z',
          ),
        ]),
        user,
      ),
    ).toEqual([])
  })

  it('should group the declaration and its files under the defendant, oldest first', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'attachment',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
          '2026-06-04T13:35:00.000Z',
        ),
        file(
          'declaration',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
      ]),
      user,
    )

    expect(groups).toHaveLength(1)
    expect(groups[0].defendant.id).toBe('own_client_id')
    expect(groups[0].files.map((f) => f.id)).toEqual([
      'declaration',
      'attachment',
    ])
  })

  it('should leave out the files of a defendant this defender does not represent', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'own',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
        file(
          'other',
          'other_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-05T13:34:00.000Z',
        ),
      ]),
      user,
    )

    expect(groups.map((g) => g.defendant.id)).toEqual(['own_client_id'])
  })

  it('should show a prosecution user every defendant, in case order', () => {
    const groups = getVerdictAppealFileGroups(
      theCase([
        file(
          'other',
          'other_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-03T13:34:00.000Z',
        ),
        file(
          'own',
          'own_client_id',
          CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          '2026-06-04T13:34:00.000Z',
        ),
      ]),
      mockUser(UserRole.PROSECUTOR),
    )

    expect(groups.map((g) => g.defendant.id)).toEqual([
      'own_client_id',
      'other_client_id',
    ])
  })
})
