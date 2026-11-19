import { BadRequestException } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'

import { SdfController } from '../sdf.controller'
import type { SdfScreenService } from '../sdf-screen.service'
import { ExecuteActionDto, SdfActionType } from '../dto/action.dto'

const APPLICATION_ID = '00000000-0000-0000-0000-000000000001'
const user = { nationalId: '0101302989' } as User

const buildController = () => {
  const sdfScreenService = {
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
