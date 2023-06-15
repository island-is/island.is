import { INestApplication } from '@nestjs/common'

import { Test } from '@nestjs/testing'
import { createTestIntl } from '@island.is/cms-translations/test'
import { LoggingModule } from '@island.is/logging'
import {
  TemplateApi,
  PerformActionResult,
  defineTemplateApi,
  FormatMessage,
} from '@island.is/application/types'
import {
  ApplicationApiCoreModule,
  ApplicationService,
} from '@island.is/application/api/core'
import {
  TemplateApiModuleActionProps,
  TemplateAPIService,
} from '@island.is/application/template-api-modules'
import { TemplateApiActionRunner } from './templateApiActionRunner.service'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'

let app: INestApplication

let runner: TemplateApiActionRunner
let applicationService: ApplicationService
let templateAPIService: TemplateAPIService

const mockPerformAction = jest.fn().mockResolvedValue({
  success: true,
  response: { key: 'value' },
})

const mockTemplateAPIService = {
  performAction: mockPerformAction,
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      TemplateApiActionRunner,
      {
        provide: ApplicationService,
        useValue: {
          updateExternalData: jest.fn().mockResolvedValue(undefined),
        },
      },
      {
        provide: TemplateAPIService,
        useClass: jest.fn(() => ({
          performAction(action: {
            templateId: string
            actionId: string
            action: string
            props: TemplateApiModuleActionProps<any>
          }) {
            return {
              success: true,
              response: { key: 'value' },
            }
          },
        })),
      },
    ],
  }).compile()

  runner = moduleRef.get<TemplateApiActionRunner>(TemplateApiActionRunner)
  applicationService = moduleRef.get<ApplicationService>(ApplicationService)
  templateAPIService = moduleRef.get<TemplateAPIService>(TemplateAPIService)
})

describe('TemplateApi Action runner', () => {
  it(`Should sort and default to Zero`, async () => {
    const withOrder2 = defineTemplateApi({
      action: 'withOrder2',
      order: 2,
    })

    const with0rder1 = defineTemplateApi({
      action: 'withOrder1',
      order: 1,
    })

    const withNoOrderSet = defineTemplateApi({
      action: 'withNoOrderSet',
    })

    const otherWithOrder2 = defineTemplateApi({
      action: 'otherWithOrder2',
      order: 2,
    })
    const actions: TemplateApi[] = [
      withOrder2,
      with0rder1,
      withNoOrderSet,
      otherWithOrder2,
    ]

    const result = runner.sortActions(actions)

    expect(result[0]).toBe(withNoOrderSet)
    expect(result[1]).toBe(with0rder1)
  })

  it(`Should group actions by order`, async () => {
    const orderedActions: TemplateApi[] = [
      defineTemplateApi({
        action: 'withOrder0',
        order: 0,
      }),
      defineTemplateApi({
        action: 'otherWithOrder0',
        order: 0,
      }),
      defineTemplateApi({
        action: 'withNoOrder1',
        order: 1,
      }),
      defineTemplateApi({
        action: 'otherWithOrder1',
        order: 1,
      }),
      defineTemplateApi({
        action: 'otherWithOrder2',
        order: 2,
      }),
    ]

    const result = runner.groupByOrder(orderedActions)

    expect(result[0][0]).toBe(orderedActions[0])
    expect(result[0][1]).toBe(orderedActions[1])
    expect(result[1][0]).toBe(orderedActions[2])
    expect(result[1][1]).toBe(orderedActions[3])
    expect(result[2][0]).toBe(orderedActions[4])
  })

  it('should run actions have property and persist data', async () => {
    const application = createApplication()
    const auth = createCurrentUser()
    const currentUserLocale = 'en'
    const formatMessage = jest.fn()

    const templateApi = defineTemplateApi({
      action: 'testAction',
    })

    jest.spyOn(templateAPIService, 'performAction').mockResolvedValue({
      success: true,
      response: { key: 'value' },
    })

    const result = await runner.run(
      application,
      [templateApi],
      auth,
      currentUserLocale,
      formatMessage,
    )

    expect(result).toEqual(application)
    expect(result.externalData).toHaveProperty('testAction')
    expect(applicationService.updateExternalData).toHaveBeenCalled()
  })

  it('should override externalData', async () => {
    const application = createApplication()
    const auth = createCurrentUser()
    const currentUserLocale = 'en'
    const formatMessage = jest.fn()

    const templateApi = defineTemplateApi({
      action: 'testAction',
      externalDataId: 'newExternalDataId',
    })

    jest.spyOn(templateAPIService, 'performAction').mockResolvedValue({
      success: true,
      response: { key: 'value' },
    })

    const result = await runner.run(
      application,
      [templateApi],
      auth,
      currentUserLocale,
      formatMessage,
    )

    expect(result).toEqual(application)
    expect(result.externalData).toHaveProperty('newExternalDataId')
    expect(applicationService.updateExternalData).toHaveBeenCalled()
  })

  it('should run actions and not persist data', async () => {
    const application = createApplication()
    const auth = createCurrentUser()
    const currentUserLocale = 'en'
    const formatMessage = jest.fn()

    const applicationServiceSpy = jest.spyOn(
      applicationService,
      'updateExternalData',
    )

    const templateApi = defineTemplateApi({
      action: 'testAction',
      shouldPersistToExternalData: false,
    })

    jest.spyOn(templateAPIService, 'performAction').mockResolvedValueOnce({
      success: true,
      response: { key: 'value' },
    })

    const result = await runner.run(
      application,
      [templateApi],
      auth,
      currentUserLocale,
      formatMessage,
    )

    expect(result).toEqual(application)
    expect(result.externalData).toHaveProperty('testAction')
    expect(applicationServiceSpy).toHaveBeenCalledWith(application.id, {}, {})
  })

  it('should run actions in correct order', async () => {
    const application = createApplication()
    const auth = createCurrentUser()
    const currentUserLocale = 'en'
    const formatMessage = jest.fn()

    const templateApi = defineTemplateApi({
      action: 'testAction1',
      order: 1,
    })

    const templateApi2 = defineTemplateApi({
      action: 'testAction2',
      order: 3,
    })

    const templateApi3 = defineTemplateApi({
      action: 'testAction3',
      order: 2,
    })

    jest
      .spyOn(templateAPIService, 'performAction')
      .mockResolvedValueOnce({
        success: true,
        response: { key: 'first' },
      })
      .mockResolvedValueOnce({
        success: true,
        response: { key: 'second' },
      })
      .mockResolvedValueOnce({
        success: true,
        response: { key: 'third' },
      })

    const result = await runner.run(
      application,
      [templateApi, templateApi2, templateApi3],
      auth,
      currentUserLocale,
      formatMessage,
    )

    expect(result.externalData).toHaveProperty('testAction1')
    expect(result.externalData.testAction1?.data).toEqual({ key: 'first' })

    expect(result.externalData).toHaveProperty('testAction2')
    expect(result.externalData.testAction2?.data).toEqual({ key: 'third' })

    expect(result.externalData).toHaveProperty('testAction3')
    expect(result.externalData.testAction3?.data).toEqual({ key: 'second' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
