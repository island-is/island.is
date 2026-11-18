import type { User } from '@island.is/auth-nest-tools'

import type { HealthDirectorateService } from '../health-directorate.service'
import type { MedicineDelegationStepUpService } from '../medicine-delegation-step-up.service'
import { MedicineResolver } from './medicine.resolver'

const user = { nationalId: '0101302399', client: '@island.is/web' } as User

const input = {
  nationalId: '0101307789',
  from: new Date('2026-11-18T00:00:00Z'),
  to: new Date('2027-11-18T00:00:00Z'),
  lookup: false,
}

const setup = () => {
  const api = {
    postMedicineDelegation: jest.fn().mockResolvedValue({ success: true }),
  }
  const stepUp = {
    isRequired: jest.fn(),
    start: jest.fn(),
    check: jest.fn(),
  }
  const resolver = new MedicineResolver(
    api as unknown as HealthDirectorateService,
    stepUp as unknown as MedicineDelegationStepUpService,
  )
  return { resolver, api, stepUp }
}

describe('MedicineResolver pharmacy delegations', () => {
  it('saves directly when no step-up is required', async () => {
    const { resolver, api, stepUp } = setup()
    stepUp.isRequired.mockResolvedValue(false)

    const result = await resolver.postMedicineDelegation(input, user)

    expect(result).toEqual({ success: true })
    expect(api.postMedicineDelegation).toHaveBeenCalledWith(user, input)
    expect(stepUp.start).not.toHaveBeenCalled()
  })

  it('starts a step-up and saves nothing when one is required', async () => {
    const { resolver, api, stepUp } = setup()
    stepUp.isRequired.mockResolvedValue(true)
    stepUp.start.mockResolvedValue({
      authReqId: 'req',
      method: 'sim',
      verificationCode: '1234',
      interval: 5,
      expiresIn: 300,
    })

    const result = await resolver.postMedicineDelegation(input, user)

    expect(result.success).toBe(false)
    expect(result.stepUp).toMatchObject({ authReqId: 'req', method: 'sim' })
    expect(api.postMedicineDelegation).not.toHaveBeenCalled()
  })

  it('saves nothing when the step-up could not start', async () => {
    const { resolver, api, stepUp } = setup()
    stepUp.isRequired.mockResolvedValue(true)
    stepUp.start.mockRejectedValue(new Error('unavailable'))

    await expect(resolver.postMedicineDelegation(input, user)).rejects.toThrow(
      'unavailable',
    )
    expect(api.postMedicineDelegation).not.toHaveBeenCalled()
  })

  it.each(['pending', 'denied', 'expired'] as const)(
    'saves nothing while the step-up is %s',
    async (status) => {
      const { resolver, api, stepUp } = setup()
      stepUp.check.mockResolvedValue(status)

      const result = await resolver.checkMedicineDelegationStepUp(
        { authReqId: 'req', delegation: input },
        user,
      )

      expect(result).toEqual({ status, success: false })
      expect(api.postMedicineDelegation).not.toHaveBeenCalled()
    },
  )

  it('saves nothing when the authentication is refused', async () => {
    const { resolver, api, stepUp } = setup()
    stepUp.check.mockRejectedValue(new Error('not for this delegation'))

    await expect(
      resolver.checkMedicineDelegationStepUp(
        { authReqId: 'req', delegation: input },
        user,
      ),
    ).rejects.toThrow('not for this delegation')
    expect(api.postMedicineDelegation).not.toHaveBeenCalled()
  })

  it('saves the checked delegation once the step-up is confirmed', async () => {
    const { resolver, api, stepUp } = setup()
    stepUp.check.mockResolvedValue('confirmed')

    const result = await resolver.checkMedicineDelegationStepUp(
      { authReqId: 'req', delegation: input },
      user,
    )

    expect(stepUp.check).toHaveBeenCalledWith(user, 'req', input)
    expect(api.postMedicineDelegation).toHaveBeenCalledWith(user, input)
    expect(result).toEqual({ status: 'confirmed', success: true })
  })
})
