import { Op } from 'sequelize'
import { Model, Sequelize } from 'sequelize-typescript'

import { AppealCaseType } from '@island.is/judicial-system/types'

import * as repository from '../index'

/**
 * The separation between ruling appeals and verdict appeals rests entirely on the association
 * scopes below: Sequelize copies an association scope into the ON clause of
 * every join of that alias, so a verdict appeal cannot reach a list, a case view
 * or the appeal banner that asks for `appealCase`, and none of them has to
 * filter for it. Lose the scope and a verdict appeal in APPEALED starts appearing in
 * the district court's "Kærð mál" tab.
 */
describe('Case appeal case associations', () => {
  beforeAll(() => {
    // Associations are only resolved once the models are registered. No
    // connection is opened - nothing here queries.
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as typeof Model[]

    new Sequelize({ dialect: 'postgres', models, logging: false })
  })

  it('scopes the case level appeal to a ruling appeal without a ruling file', () => {
    const { scope } = repository.Case.associations.appealCase

    expect(scope).toEqual({
      rulingFileId: null,
      appealType: AppealCaseType.RULING,
    })
  })

  it('scopes ruling order appeals to rows carrying a ruling file', () => {
    const { scope } = repository.Case.associations.rulingOrderAppealCases

    // A verdict appeal is case level, so it never has a ruling file and this
    // scope excludes it without naming the type.
    expect(scope).toEqual({ rulingFileId: { [Op.not]: null } })
  })
})
