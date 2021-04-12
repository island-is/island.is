import { INestApplication } from '@nestjs/common'

import { setup } from '../../../../../../test/setup'
import { IcelandicNameService } from '../../icelandic-name.service'
import { CreateIcelandicNameBody } from '../../dto'

let app: INestApplication
let icelandicNameService: IcelandicNameService

beforeAll(async () => {
  app = await setup()
  icelandicNameService = app.get<IcelandicNameService>(IcelandicNameService)
})

describe('create', () => {
  const icelandicNameDto: CreateIcelandicNameBody = {
    icelandicName: 'Laqueesha',
    type: 'ST',
    status: 'Haf',
    visible: true,
    verdict: 'verdict',
    url: 'url',
  }

  it('should create a new record', async () => {
    const result = await icelandicNameService.createName(icelandicNameDto)

    expect(result.id).toEqual(1)
    expect(result.icelandicName).toEqual(icelandicNameDto.icelandicName)
    expect(result.type).toEqual(icelandicNameDto.type)
    expect(result.status).toEqual(icelandicNameDto.status)
    expect(result.visible).toEqual(icelandicNameDto.visible)
    expect(result.url).toEqual(icelandicNameDto.url)
    expect(result.created).toBeInstanceOf(Date)
    expect(result.modified).toBeInstanceOf(Date)
  })
})
