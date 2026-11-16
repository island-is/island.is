import {
  EQUALITY_ATTACHMENT_REJECTED,
  MAX_ATTACHMENT_BYTES,
  getAttachmentExtension,
  getAttachmentRejection,
  validateAttachment,
} from './equalityAttachments'

describe('getAttachmentExtension', () => {
  it.each([
    ['plan.pdf', 'pdf'],
    ['Aðgerðir.XLSX', 'xlsx'],
    ['gamalt.v2.xls', 'xls'],
    ['skjal.docx', 'docx'],
  ])('reads %s as %s', (name, extension) => {
    expect(getAttachmentExtension(name)).toBe(extension)
  })

  it.each(['plan', 'plan.xlsm', 'plan.docm', 'plan.txt', 'pdf'])(
    'refuses %s',
    (name) => {
      expect(getAttachmentExtension(name)).toBeUndefined()
    },
  )
})

describe('validateAttachment', () => {
  it('accepts a file at exactly the size limit', () => {
    expect(
      validateAttachment({ name: 'a.pdf', size: MAX_ATTACHMENT_BYTES }),
    ).toBeUndefined()
  })

  it('refuses a file over the size limit', () => {
    expect(
      validateAttachment({ name: 'a.pdf', size: MAX_ATTACHMENT_BYTES + 1 }),
    ).toBe('tooLarge')
  })

  it('refuses an empty file', () => {
    expect(validateAttachment({ name: 'a.pdf', size: 0 })).toBe('empty')
  })

  it('checks the type before the size', () => {
    expect(validateAttachment({ name: 'a.xlsm', size: 0 })).toBe(
      'unsupportedType',
    )
  })

  it('refuses a filename DMR would not store', () => {
    expect(
      validateAttachment({ name: `${'a'.repeat(252)}.pdf`, size: 1 }),
    ).toBe('filenameTooLong')
  })
})

describe('getAttachmentRejection', () => {
  const graphQLError = (problem: Record<string, unknown>) => ({
    graphQLErrors: [{ extensions: { problem } }],
  })

  it("returns DMR's reason", () => {
    expect(
      getAttachmentRejection(
        graphQLError({
          title: EQUALITY_ATTACHMENT_REJECTED,
          detail: 'Skjalið inniheldur fjölva.',
        }),
      ),
    ).toEqual({ rejected: true, reason: 'Skjalið inniheldur fjölva.' })
  })

  it('marks a refusal without a reason as rejected', () => {
    expect(
      getAttachmentRejection(
        graphQLError({ title: EQUALITY_ATTACHMENT_REJECTED, detail: '' }),
      ),
    ).toEqual({ rejected: true, reason: undefined })
  })

  it('ignores any other error', () => {
    expect(
      getAttachmentRejection(
        graphQLError({ title: 'Internal Server Error', detail: 'boom' }),
      ),
    ).toEqual({ rejected: false })
    expect(getAttachmentRejection(new Error('network'))).toEqual({
      rejected: false,
    })
  })
})
