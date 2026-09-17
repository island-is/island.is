import { Model, ModelCtor, Sequelize } from 'sequelize-typescript'

import * as repository from '../index'
import { Case } from '../models/case.model'
import {
  caseStatisticsInclude,
  indictmentCaseEventExportInclude,
  requestCaseEventExportInclude,
} from '../types/caseRepository.types'

// The repository specs mock the model, so they see the include graph as a plain
// object and never ask Sequelize whether it is a valid eager load. An include
// that names a model without its association alias passes every one of them and
// throws at runtime, which is how the statistics reads came to be written that
// way. This spec registers the real models and puts each graph through the same
// validation findAll performs before it builds any SQL.
describe('CaseRepositoryService - statistics include graphs', () => {
  beforeAll(() => {
    const models = Object.values(repository).filter(
      (exported) =>
        typeof exported === 'function' && exported.prototype instanceof Model,
    ) as ModelCtor[]

    new Sequelize({ dialect: 'postgres', models, logging: false })
  })

  // What findAll calls once it has conformed its includes, and the only place
  // an unaliased include is rejected
  const validateIncludedElements = (options: unknown) =>
    (Case as unknown as Record<string, (options: unknown) => void>)[
      '_validateIncludedElements'
    ](options)

  it.each([
    ['the case statistics read', caseStatisticsInclude],
    ['the request case event export', requestCaseEventExportInclude],
    ['the indictment case event export', indictmentCaseEventExportInclude],
  ])('should be a valid eager load for %s', (_, include) => {
    expect(() =>
      validateIncludedElements({ model: Case, include: [...include] }),
    ).not.toThrow()
  })
})
