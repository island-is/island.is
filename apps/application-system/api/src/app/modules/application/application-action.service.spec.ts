import { Test, TestingModule } from '@nestjs/testing'
import { ApplicationActionService } from './application-action.service'
import { LoggingModule } from '@island.is/logging'
import { IntlService } from '@island.is/cms-translations'
import { TemplateApiActionRunner } from './tools/templateApiActionRunner.service'
import { ApplicationService } from '@island.is/application/api/core'
import { HistoryService } from '@island.is/application/api/history'
import {
  createApplicationTemplate,
  createApplication,
} from '@island.is/application/testing'
import {
  DefaultEvents,
  TemplateApi,
  defineTemplateApi,
} from '@island.is/application/types'

describe('ApplicationActionService', () => {
  const application = createApplication()
  let service: ApplicationActionService
  let mockIntlService: any
  let mockTemplateApiActionRunner: any
  let mockApplicationService: any
  let mockHistoryService: any

  beforeEach(async () => {
    mockIntlService = {
      useIntl: jest.fn().mockResolvedValue({ formatMessage: jest.fn() }),
    }

    mockTemplateApiActionRunner = {
      run: jest.fn().mockResolvedValue({
        ...application,
        externalData: {
          ...application.externalData,
          someDataId: {
            data: {},
            date: new Date(),
            status: 200,
          },
        },
        hasError: false,
      }),
    }

    mockApplicationService = {
      clearNonces: jest.fn().mockResolvedValue({}),
      updateApplicationState: jest
        .fn()
        .mockResolvedValue({ updatedApplication: {} }),
    }

    mockHistoryService = {
      saveStateTransition: jest.fn().mockResolvedValue({}),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationActionService,
        { provide: IntlService, useValue: mockIntlService },
        {
          provide: TemplateApiActionRunner,
          useValue: mockTemplateApiActionRunner,
        },
        { provide: ApplicationService, useValue: mockApplicationService },
        { provide: HistoryService, useValue: mockHistoryService },
      ],
      imports: [LoggingModule],
    }).compile()

    service = module.get<ApplicationActionService>(ApplicationActionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('performActionOnApplication', () => {
    const baseApi: TemplateApi = defineTemplateApi({
      action: 'someAction',
      externalDataId: 'someDataId',
    })

    const template = createApplicationTemplate()

    beforeEach(() => {
      // Reset the mock calls for clarity in each test
      mockTemplateApiActionRunner.run.mockClear()
    })

    it('should filter out actions with a different triggerEvent', async () => {
      const submitApi = baseApi.configure({
        triggerEvent: DefaultEvents.SUBMIT,
      })
      const abortApi = baseApi.configure({
        triggerEvent: DefaultEvents.ABORT,
        externalDataId: 'someOtherDataId',
      })
      const apis = [submitApi, abortApi]

      await service.performActionOnApplication(
        application,
        template,
        {} as any,
        apis,
        'en',
        DefaultEvents.SUBMIT,
      )

      expect(mockTemplateApiActionRunner.run).toHaveBeenCalledWith(
        expect.anything(),
        [submitApi],
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should trigger actions with no defined triggerEvent', async () => {
      const apis = [baseApi]

      await service.performActionOnApplication(
        application,
        template,
        {} as any,
        apis,
        'en',
        DefaultEvents.SUBMIT,
      )

      expect(mockTemplateApiActionRunner.run).toHaveBeenCalledWith(
        expect.anything(),
        apis,
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should trigger actions with matching triggerEvent', async () => {
      const apis = [baseApi.configure({ triggerEvent: DefaultEvents.PAYMENT })]

      await service.performActionOnApplication(
        application,
        template,
        {} as any,
        apis,
        'en',
        DefaultEvents.PAYMENT,
      )

      expect(mockTemplateApiActionRunner.run).toHaveBeenCalledWith(
        expect.anything(),
        apis,
        expect.anything(),
        expect.anything(),
        expect.anything(),
      )
    })

    it('should not trigger actions with non-matching triggerEvent', async () => {
      const apis = [baseApi.configure({ triggerEvent: DefaultEvents.ASSIGN })]

      await service.performActionOnApplication(
        application,
        template,
        {} as any,
        apis,
        'en',
        DefaultEvents.EDIT,
      )

      expect(mockTemplateApiActionRunner.run).not.toHaveBeenCalled()
    })

    it('should return early if no apis are left', async () => {
      const result = await service.performActionOnApplication(
        application,
        template,
        {} as any,
        [],
        'en',
        'event',
      )

      expect(result).toEqual({
        updatedApplication: application,
        hasError: false,
      })
    })
  })

  describe('changeState', () => {
    it('should return error if application update fails', async () => {
      mockApplicationService.updateApplicationState.mockRejectedValueOnce(
        new Error('Update failed'),
      )

      const result = await service.changeState(
        createApplication(),
        createApplicationTemplate(),
        'SUBMIT',
        {} as any,
        'en',
      )

      expect(result).toEqual({
        hasChanged: false,
        hasError: true,
        application: result.application,
        error: 'Could not update application',
      })
    })
  })
})
