import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { VerdictExistsGuard } from '../../guards/verdictExists.guard'

describe('VerdictExistsGuard', () => {
  const guard = new VerdictExistsGuard()

  const createContext = (defendant: unknown) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ defendant }),
      }),
    } as ExecutionContext)

  it('sets request.verdict to the active verdict', async () => {
    const request = {
      defendant: {
        verdicts: [
          {
            id: 'old',
            isActive: false,
            created: new Date('2026-01-01'),
          },
          {
            id: 'active',
            isActive: true,
            created: new Date('2026-06-01'),
          },
        ],
      },
    }

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext

    await expect(guard.canActivate(context)).resolves.toBe(true)
    expect(request).toEqual(
      expect.objectContaining({
        verdict: expect.objectContaining({ id: 'active' }),
      }),
    )
  })

  it('throws when defendant is missing', async () => {
    await expect(guard.canActivate(createContext(undefined))).rejects.toBeInstanceOf(
      BadRequestException,
    )
  })

  it('throws when defendant has no verdicts', async () => {
    await expect(
      guard.canActivate(createContext({ verdicts: [] })),
    ).rejects.toBeInstanceOf(NotFoundException)
  })
})
