import { BadRequestException } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'

import { SdfController } from '../sdf.controller'
import type { SdfScreenService } from '../sdf-screen.service'
import { ExecuteActionDto, SdfActionType } from '../dto/action.dto'

const APPLICATION_ID = '00000000-0000-0000-0000-000000000001'
const user = { nationalId: '0101302989' } as User

const buildController = () => {
  const sdfScreenService = {
    getScreenById: jest.fn().mockResolvedValue({}),
    persistAnswersAndAdvance: jest.fn().mockResolvedValue({}),
    handleSubmit: jest.fn().mockResolvedValue({}),
    goToPage: jest.fn().mockResolvedValue({}),
  }
  const controller = new SdfController(
    sdfScreenService as unknown as SdfScreenService,
  )
  return { controller, sdfScreenService }
}

// Only the fields a request under test carries; the rest are irrelevant here.
const actionDto = (fields: Partial<ExecuteActionDto>) =>
  fields as ExecuteActionDto

describe('SdfController.getScreen', () => {
  it('asks the service for the screen with the given id and locale', async () => {
    const { controller, sdfScreenService } = buildController()

    await controller.getScreen(APPLICATION_ID, 'page1', 'en', user)

    expect(sdfScreenService.getScreenById).toHaveBeenCalledWith(
      APPLICATION_ID,
      'page1',
      'en',
      user,
    )
  })

  it('passes no id, and the Icelandic locale, when neither is given', async () => {
    const { controller, sdfScreenService } = buildController()

    await controller.getScreen(APPLICATION_ID, undefined, undefined, user)

    expect(sdfScreenService.getScreenById).toHaveBeenCalledWith(
      APPLICATION_ID,
      undefined,
      'is',
      user,
    )
  })

  it('treats a repeated screen parameter, which arrives as an array, as no id', async () => {
    const { controller, sdfScreenService } = buildController()

    await controller.getScreen(
      APPLICATION_ID,
      ['page0', 'page1'] as unknown as string,
      'is',
      user,
    )

    expect(sdfScreenService.getScreenById).toHaveBeenCalledWith(
      APPLICATION_ID,
      undefined,
      'is',
      user,
    )
  })
})

describe('SdfController.executeAction — NEXT_PAGE', () => {
  it.each([
    ['missing', undefined],
    ['empty', ''],
  ])(
    'rejects with 400 when screen is %s, and never reaches the service',
    async (_label, screen) => {
      const { controller, sdfScreenService } = buildController()
      const dto = actionDto({ actionType: SdfActionType.NEXT_PAGE, screen })

      await expect(
        controller.executeAction(APPLICATION_ID, dto, user),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(sdfScreenService.persistAnswersAndAdvance).not.toHaveBeenCalled()
    },
  )

  it('forwards the screen the client is on', async () => {
    const { controller, sdfScreenService } = buildController()
    const dto = actionDto({
      actionType: SdfActionType.NEXT_PAGE,
      answers: { foo: 'bar' },
      screen: 'page1',
    })

    await controller.executeAction(APPLICATION_ID, dto, user)

    expect(sdfScreenService.persistAnswersAndAdvance).toHaveBeenCalledWith(
      APPLICATION_ID,
      { foo: 'bar' },
      'is',
      user,
      'page1',
    )
  })
})

describe('SdfController.executeAction — SUBMIT', () => {
  it.each([
    ['missing', undefined],
    ['empty', ''],
  ])(
    'rejects with 400 when event is %s, and never reaches the service',
    async (_label, event) => {
      const { controller, sdfScreenService } = buildController()
      const dto = actionDto({ actionType: SdfActionType.SUBMIT, event })

      await expect(
        controller.executeAction(APPLICATION_ID, dto, user),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(sdfScreenService.handleSubmit).not.toHaveBeenCalled()
    },
  )

  it('forwards the given event unchanged (no SUBMIT fallback)', async () => {
    const { controller, sdfScreenService } = buildController()
    const dto = actionDto({
      actionType: SdfActionType.SUBMIT,
      event: 'APPROVE',
      answers: { foo: 'bar' },
    })

    await controller.executeAction(APPLICATION_ID, dto, user)

    expect(sdfScreenService.handleSubmit).toHaveBeenCalledWith(
      APPLICATION_ID,
      'APPROVE',
      { foo: 'bar' },
      'is',
      user,
    )
  })
})

describe('SdfController.executeAction — GO_TO_PAGE', () => {
  it.each([
    ['missing', undefined],
    ['empty', ''],
  ])(
    'rejects with 400 when event (the page id) is %s, and never reaches the service',
    async (_label, event) => {
      const { controller, sdfScreenService } = buildController()
      const dto = actionDto({ actionType: SdfActionType.GO_TO_PAGE, event })

      await expect(
        controller.executeAction(APPLICATION_ID, dto, user),
      ).rejects.toBeInstanceOf(BadRequestException)
      expect(sdfScreenService.goToPage).not.toHaveBeenCalled()
    },
  )

  it('forwards the event as the destination page id', async () => {
    const { controller, sdfScreenService } = buildController()
    const dto = actionDto({
      actionType: SdfActionType.GO_TO_PAGE,
      event: 'applicantPage',
    })

    await controller.executeAction(APPLICATION_ID, dto, user)

    expect(sdfScreenService.goToPage).toHaveBeenCalledWith(
      APPLICATION_ID,
      'applicantPage',
      'is',
      user,
    )
  })
})
