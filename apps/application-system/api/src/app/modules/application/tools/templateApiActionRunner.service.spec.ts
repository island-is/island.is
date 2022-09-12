import { INestApplication } from '@nestjs/common'
import { TemplateApiActionRunner } from './templateApiActionRunner.service'
import { Test } from '@nestjs/testing'
import { LoggingModule } from '@island.is/logging'
import {
  TemplateApi,
  PerformActionResult,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
import { TemplateAPIService } from '@island.is/application/template-api-modules'
import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'
import { ConfigBase } from 'aws-sdk/lib/config-base'
import { canConsumeForm } from '@island.is/clients/islykill'

let app: INestApplication

let templateApiRunnerService: TemplateApiActionRunner

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [LoggingModule, ApplicationApiCoreModule],
    providers: [
      TemplateApiActionRunner,
      {
        provide: TemplateAPIService,
        useClass: jest.fn(() => ({
          performAction(action: {
            templateId: string
            type: string
            props: TemplateApiModuleActionProps
            namespace?: string
          }): Promise<PerformActionResult> {
            //return dummy result
            return Promise.resolve({
              success: true,
              response: {},
            })
          },
        })),
      },
    ],
  }).compile()

  templateApiRunnerService = moduleRef.get<TemplateApiActionRunner>(
    TemplateApiActionRunner,
  )
})

describe('TemplateApi Action runner', () => {
  it('should call action', async () => {
    const templateApi: TemplateApi = {
      actionId: 'sendApplication',
      action: 'sendApplication',
      externalDataId: 'sendApplication',
      params: {},
    }

    await templateApiRunnerService.callAction(templateApi)
  })
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

    const result = templateApiRunnerService.sortActions(actions)

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

    const result = templateApiRunnerService.groupByOrder(orderedActions)

    expect(result[0][0]).toBe(orderedActions[0])
    expect(result[0][1]).toBe(orderedActions[1])
    expect(result[1][0]).toBe(orderedActions[2])
    expect(result[1][1]).toBe(orderedActions[3])
    expect(result[2][0]).toBe(orderedActions[4])
  })
})
