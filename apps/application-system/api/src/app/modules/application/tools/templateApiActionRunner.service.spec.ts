import { INestApplication } from '@nestjs/common'
import { TemplateApiActionRunner } from './templateApiActionRunner.service'
import { Test } from '@nestjs/testing'
import { LoggingModule } from '@island.is/logging'
import {
  ApplicationTemplateAPIAction,
  ApplicationWithAttachments,
  ExternalData,
  PerformActionResult,
} from '@island.is/application/core'
import {
  ApplicationApiCoreModule,
  ApplicationService,
} from '@island.is/application/api/core'
import { TemplateAPIService } from '@island.is/application/template-api-modules'
import { TemplateApiModuleActionProps } from '@island.is/application/template-api-modules'
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
  it(`Should sort and default to Zero`, async () => {
    const actions: ApplicationTemplateAPIAction[] = [
      {
        apiModuleAction: 'withOrder2',
        order: 2,
      },
      {
        apiModuleAction: 'withOrder1',
        order: 1,
      },
      {
        apiModuleAction: 'withNoOrderSet',
      },
      {
        apiModuleAction: 'otherWithOrder2',
        order: 2,
      },
    ]

    const result = templateApiRunnerService.sortAndSetUndefinedOrderToZero(
      actions,
    )
    console.log(result)
    expect(result[0]).toBe(actions[2])
    expect(result[1]).toBe(actions[1])
  })

  it(`Should group actions by order`, async () => {
    const orderedActions: ApplicationTemplateAPIAction[] = [
      {
        apiModuleAction: 'withOrder0',
        order: 0,
      },
      {
        apiModuleAction: 'otherWithOrder0',
        order: 0,
      },
      {
        apiModuleAction: 'withNoOrder1',
        order: 1,
      },
      {
        apiModuleAction: 'otherWithOrder1',
        order: 1,
      },
      {
        apiModuleAction: 'otherWithOrder2',
        order: 2,
      },
    ]

    const result = templateApiRunnerService.groupByOrder(orderedActions)

    expect(result[0][0]).toBe(orderedActions[0])
    expect(result[0][1]).toBe(orderedActions[1])
    expect(result[1][0]).toBe(orderedActions[2])
    expect(result[1][1]).toBe(orderedActions[3])
    expect(result[2][0]).toBe(orderedActions[4])
  })
})
