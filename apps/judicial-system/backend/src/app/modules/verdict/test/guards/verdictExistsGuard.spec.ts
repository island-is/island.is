import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { VerdictExistsGuard } from '../../guards/verdictExists.guard'

describe('VerdictExistsGuard', () => {
  const guard = new VerdictExistsGuard()

  const createContext = (request: { defendant?: unknown }) =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    }) as ExecutionContext

  it('sets request.verdict to the newest verdict by created', async () => {
    const request = {
      defendant: {
        verdicts: [
          {
            id: 'older',
            created: new Date('2026-01-01'),
          },
          {
            id: 'newer',
            created: new Date('2026-06-01'),
          },
        ],
      },
    }

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true)
    expect(request).toEqual(
      expect.objectContaining({
        verdict: expect.objectContaining({ id: 'newer' }),
      }),
    )
  })

  it('throws when defendant is missing', async () => {
    await expect(
      guard.canActivate(createContext({})),
    ).rejects.toBeInstanceOf(BadRequestException)
  })

  it('throws when defendant has no verdicts', async () => {
    await expect(
      guard.canActivate(createContext({ defendant: { verdicts: [] } })),
    ).rejects.toBeInstanceOf(NotFoundException)
  })
})
