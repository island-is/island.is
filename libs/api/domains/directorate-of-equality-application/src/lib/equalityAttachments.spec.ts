import { HttpException } from '@nestjs/common'

import {
  EQUALITY_ATTACHMENT_REJECTED,
  normaliseAttachmentExtension,
  toAttachmentRejection,
} from './equalityAttachments'

describe('normaliseAttachmentExtension', () => {
  it.each([
    ['pdf', 'pdf'],
    ['.XLSX', 'xlsx'],
    [' .Docx ', 'docx'],
    ['xls', 'xls'],
  ])('reads %p as %p', (input, expected) => {
    expect(normaliseAttachmentExtension(input)).toBe(expected)
  })

  it.each(['xlsm', 'docm', 'txt', '', '..pdf'])('refuses %p', (input) => {
    expect(normaliseAttachmentExtension(input)).toBeUndefined()
  })
})

describe('toAttachmentRejection', () => {
  it("carries DMR's translated reason under the rejection title", () => {
    const rejection = toAttachmentRejection(400, {
      message: 'Macros detected',
      translatedMessage: 'Skjalið inniheldur fjölva.',
    })

    expect(rejection).toBeInstanceOf(HttpException)
    expect(rejection?.getStatus()).toBe(400)
    expect(rejection?.getResponse()).toEqual({
      error: EQUALITY_ATTACHMENT_REJECTED,
      message: 'Skjalið inniheldur fjölva.',
    })
  })

  it('keeps the status and an empty reason when DMR gives none', () => {
    const rejection = toAttachmentRejection(404, undefined)

    expect(rejection?.getStatus()).toBe(404)
    expect(rejection?.getResponse()).toEqual({
      error: EQUALITY_ATTACHMENT_REJECTED,
      message: '',
    })
  })

  it('ignores a blank translated message', () => {
    expect(
      toAttachmentRejection(400, { translatedMessage: '   ' })?.getResponse(),
    ).toEqual({ error: EQUALITY_ATTACHMENT_REJECTED, message: '' })
  })

  it.each([200, 500, 502])('leaves status %p alone', (status) => {
    expect(
      toAttachmentRejection(status, { translatedMessage: 'x' }),
    ).toBeUndefined()
  })
})
