import { INestApplication } from '@nestjs/common'

import { NameType, StatusType } from '@island.is/icelandic-names-registry-types'
import { setup } from '../../../../../../test/setup'
import { IcelandicNameService } from '../../icelandic-name.service'
import { CreateIcelandicNameBodyDto } from '../../dto'

let app: INestApplication
let icelandicNameService: IcelandicNameService

beforeAll(async () => {
  app = await setup()
  icelandicNameService = app.get<IcelandicNameService>(IcelandicNameService)
})

describe('create', () => {
  const newIcelandicName: CreateIcelandicNameBodyDto = {
    icelandicName: 'Laqueesha',
    type: 'ST' as NameType,
    status: 'Haf' as StatusType,
    visible: true,
    verdict: 'verdict',
    url: 'url',
  }

  it('should create a new record', async () => {
    const result = await icelandicNameService.createName(newIcelandicName)

    expect(result).toMatchObject({ id: 1, ...newIcelandicName })
  })
})
