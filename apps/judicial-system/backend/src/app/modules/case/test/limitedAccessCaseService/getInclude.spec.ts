import { Includeable, IncludeOptions } from 'sequelize'

import { type User, UserRole } from '@island.is/judicial-system/types'

import { getInclude } from '../../limitedAccessCase.service'

const findInclude = (
  includes: Includeable[],
  as: string,
): IncludeOptions | undefined =>
  includes.find(
    (include): include is IncludeOptions =>
      typeof include === 'object' &&
      include !== null &&
      'as' in include &&
      include.as === as,
  )

describe('LimitedAccessCaseService - getInclude', () => {
  describe('defence user', () => {
    const user = {
      nationalId: '123456-7890',
      role: UserRole.DEFENDER,
    } as User

    it('should scope linked-case parties to the user', () => {
      const includes = getInclude(user)

      const mergeCase = findInclude(includes, 'mergeCase')
      const mergeCaseDefendants = findInclude(
        mergeCase?.include ?? [],
        'defendants',
      )
      const mergeCaseCivilClaimants = findInclude(
        mergeCase?.include ?? [],
        'civilClaimants',
      )

      expect(mergeCaseDefendants?.where).toEqual({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
      })
      expect(mergeCaseDefendants?.separate).toBeUndefined()
      expect(mergeCaseCivilClaimants?.where).toEqual({
        hasSpokesperson: true,
        spokespersonNationalId: '1234567890',
        isSpokespersonConfirmed: true,
      })

      const mergedCases = findInclude(includes, 'mergedCases')
      const mergedCaseCivilClaimants = findInclude(
        mergedCases?.include ?? [],
        'civilClaimants',
      )
      const mergedCaseDefendants = findInclude(
        mergedCases?.include ?? [],
        'defendants',
      )

      expect(mergedCaseCivilClaimants?.where).toEqual({
        hasSpokesperson: true,
        spokespersonNationalId: '1234567890',
        isSpokespersonConfirmed: true,
      })
      expect(mergedCaseDefendants?.where).toEqual({
        defenderNationalId: '1234567890',
        isDefenderChoiceConfirmed: true,
      })
      expect(mergedCaseDefendants?.separate).toBe(true)
      expect(mergedCaseDefendants?.attributes).toEqual([
        'id',
        'defenderNationalId',
        'isDefenderChoiceConfirmed',
        'isSentToPrisonAdmin',
      ])
      expect(
        findInclude(mergedCaseDefendants?.include ?? [], 'subpoenas'),
      ).toBeDefined()
      expect(mergeCaseDefendants?.attributes).toEqual([
        'id',
        'defenderNationalId',
        'isDefenderChoiceConfirmed',
      ])
    })
  })

  describe('non-defence user', () => {
    it('should not add party where filters on linked cases', () => {
      const user = {
        nationalId: '1234567890',
        role: UserRole.PROSECUTOR,
      } as User
      const includes = getInclude(user)

      const mergeCase = findInclude(includes, 'mergeCase')
      const mergeCaseDefendants = findInclude(
        mergeCase?.include ?? [],
        'defendants',
      )

      expect(mergeCaseDefendants?.where).toBeUndefined()
    })
  })
})
