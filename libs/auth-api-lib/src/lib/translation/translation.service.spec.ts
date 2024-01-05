import { Module } from '@nestjs/common'
import { getModelToken, SequelizeModule } from '@nestjs/sequelize'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { SequelizeConfigService } from '../core/sequelizeConfig.service'
import { Translation } from './models/translation.model'
import { TranslationModule } from './translation.module'
import { TranslationService } from './translation.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    TranslationModule,
  ],
})
class TestModule {}

describe('TranslationService', () => {
  let app: TestApp
  let translationService: TranslationService
  let translationModel: typeof Translation

  beforeAll(async () => {
    app = await testServer({
      appModule: TestModule,
      hooks: [
        useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
      ],
    })

    translationService = app.get(TranslationService)
    translationModel = app.get(getModelToken(Translation))

    translationModel.bulkCreate([
      {
        language: 'en',
        className: 'client',
        key: '1',
        property: 'clientName',
        value: 'English Client 1 Name',
      },
      {
        language: 'en',
        className: 'client',
        key: '2',
        property: 'clientName',
        value: 'English Client 2 Name',
      },
      {
        language: 'pl',
        className: 'client',
        key: '1',
        property: 'clientName',
        value: 'Polish Client 1 Name',
      },
      {
        language: 'pl',
        className: 'client',
        key: '2',
        property: 'clientName',
        value: 'Polish Client 2 Name',
      },
    ])
  })

  afterAll(async () => {
    await app.cleanUp()
  })

  it('findTranslationMap should return a map of translations for a given set of class instances for all languages', async () => {
    // Arrange
    const expected = new Map([
      [
        '1',
        new Map([
          ['en', new Map([['clientName', 'English Client 1 Name']])],
          ['pl', new Map([['clientName', 'Polish Client 1 Name']])],
        ]),
      ],
      [
        '2',
        new Map([
          ['en', new Map([['clientName', 'English Client 2 Name']])],
          ['pl', new Map([['clientName', 'Polish Client 2 Name']])],
        ]),
      ],
    ])

    // Act
    const result = await translationService.findTranslationMap('client', [
      '1',
      '2',
    ])

    // Assert
    expect(result).toEqual(expected)
  })

  it('findTranslationMap should return a map of translations for a given set of class instances for a specific language', async () => {
    // Arrange
    const expected = new Map([
      ['1', new Map([['clientName', 'English Client 1 Name']])],
      ['2', new Map([['clientName', 'English Client 2 Name']])],
    ])

    // Act
    const result = await translationService.findTranslationMap(
      'client',
      ['1', '2'],
      false,
      'en',
    )

    // Assert
    expect(result).toEqual(expected)
  })

  it('findTranslationMap should return a map of translations for a single class instances for a specific language', async () => {
    // Arrange
    const expected = new Map([
      ['1', new Map([['clientName', 'English Client 1 Name']])],
    ])

    // Act
    const result = await translationService.findTranslationMap(
      'client',
      ['1'],
      false,
      'en',
    )

    // Assert
    expect(result).toEqual(expected)
  })

  it('findTranslationMap should return a map of translations for a single class instances for all languages', async () => {
    // Arrange
    const expected = new Map([
      [
        '1',
        new Map([
          ['en', new Map([['clientName', 'English Client 1 Name']])],
          ['pl', new Map([['clientName', 'Polish Client 1 Name']])],
        ]),
      ],
    ])

    // Act
    const result = await translationService.findTranslationMap('client', ['1'])

    // Assert
    expect(result).toEqual(expected)
  })
})
