import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateHnippNotificationDto } from '../dto/createHnippNotification.dto'
import { toDeadlineIso } from '../utils'

const validateDeadline = async (deadline?: unknown) => {
  const dto = plainToInstance(CreateHnippNotificationDto, {
    recipient: '0101302989',
    templateId: 'HNIPP.DEMO.ID',
    args: [],
    ...(deadline !== undefined && { deadline }),
  })
  const errors = await validate(dto)
  return errors.filter((error) => error.property === 'deadline')
}

describe('CreateHnippNotificationDto deadline', () => {
  it('allows the deadline to be omitted', async () => {
    expect(await validateDeadline()).toHaveLength(0)
  })

  it.each([
    '2026-12-01T16:00:00Z',
    '2026-12-01T16:00:00.000Z',
    '2026-12-01T16:00:00+00:00',
    '2026-12-01T16:00',
    '2026-12-01T16:00:00',
  ])('accepts %s', async (deadline) => {
    expect(await validateDeadline(deadline)).toHaveLength(0)
  })

  it.each([
    '2026-12-01',
    '2026-335T16:00:00',
    '2026-W48-2T16:00:00Z',
    '20261201T160000Z',
    '2026-02-30T16:00:00Z',
    '2026-12-01T25:00:00Z',
    '1. desember 16:00',
    '',
    1764604800000,
  ])('rejects %s', async (deadline) => {
    expect(await validateDeadline(deadline)).not.toHaveLength(0)
  })
})

describe('toDeadlineIso', () => {
  it.each([
    // Without an offset the value is Icelandic time, i.e. UTC+0
    ['2026-12-01T16:00:00', '2026-12-01T16:00:00.000Z'],
    ['2026-12-01T16:00', '2026-12-01T16:00:00.000Z'],
    ['2026-07-01T16:00:00', '2026-07-01T16:00:00.000Z'],
    ['2026-12-01T16:00:00Z', '2026-12-01T16:00:00.000Z'],
    ['2026-12-01T16:00:00+00:00', '2026-12-01T16:00:00.000Z'],
    ['2026-12-01T17:00:00+01:00', '2026-12-01T16:00:00.000Z'],
    ['2026-12-01T12:00:00-0400', '2026-12-01T16:00:00.000Z'],
  ])('normalizes %s to %s', (value, expected) => {
    expect(toDeadlineIso(value)).toBe(expected)
  })
})
