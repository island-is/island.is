import { Sequelize } from 'sequelize-typescript'

import type { Logger } from '@island.is/logging'

import type { LawyerFull } from '@island.is/judicial-system/types'

import {
  LawyerRegistry,
  type LawyerRegistryRepositoryService,
} from '../../repository'
import { LawyerRegistryService } from '../lawyerRegistry.service'
import { testLawyers } from '../testLawyers'

describe('LawyerRegistryService - populate', () => {
  const transaction = {} as never

  const lmfiLawyer = {
    SSN: '1111111119',
    Name: 'Lögmaður Lögmannsson',
    Email: 'logmadur@dummy.dd',
    GSM: '1111111',
    Phone: '2222222',
    Practice: 'Lögmannsstofan',
  } as unknown as LawyerFull

  const formattedLmfiLawyer = {
    name: lmfiLawyer.Name,
    nationalId: lmfiLawyer.SSN,
    email: lmfiLawyer.Email,
    phoneNumber: lmfiLawyer.GSM,
    practice: lmfiLawyer.Practice,
    isLitigator: true,
  }

  let originalFetch: typeof global.fetch
  let replaceAll: jest.Mock

  beforeAll(() => {
    // Validation instantiates the model, which requires it to be registered.
    // No connection is opened - nothing here queries.
    new Sequelize({
      dialect: 'postgres',
      models: [LawyerRegistry],
      logging: false,
    })
  })

  const createService = (includeTestLawyers: boolean) => {
    replaceAll = jest.fn().mockResolvedValue([])

    const config = {
      lawyerRegistryAPI: 'https://lmfi.test/api',
      lawyerRegistryAPIKey: 'key',
      includeTestLawyers,
    }
    const repository = {
      replaceAll,
    } as unknown as LawyerRegistryRepositoryService
    const logger = { debug: jest.fn(), error: jest.fn() } as unknown as Logger

    return new LawyerRegistryService(config, repository, logger)
  }

  beforeEach(() => {
    originalFetch = global.fetch
    // Both the full list and the litigator list return the same lawyer
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [lmfiLawyer],
    }) as unknown as typeof global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('stores the lawyers from LMFÍ', async () => {
    await createService(false).populate(transaction)

    expect(replaceAll).toHaveBeenCalledWith([formattedLmfiLawyer], {
      transaction,
    })
  })

  it('keeps the test lawyers when configured to', async () => {
    await createService(true).populate(transaction)

    expect(replaceAll).toHaveBeenCalledWith(
      [formattedLmfiLawyer, ...testLawyers],
      { transaction },
    )
  })

  it('returns the lawyers from LMFÍ, without the test lawyers', async () => {
    const result = await createService(true).populate(transaction)

    expect(result).toEqual([lmfiLawyer])
  })
})
