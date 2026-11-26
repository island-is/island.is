import { ValidationPipe } from '@nestjs/common'

import { EditEqualityContentInput } from './editEqualityContent.input'
import { UpdateEqualityDraftContentInput } from './updateEqualityDraftContent.input'

// Same options as the API's global pipe (libs/infra-nest-server bootstrap).
const pipe = new ValidationPipe({
  forbidNonWhitelisted: true,
  forbidUnknownValues: false,
})

const validate = (metatype: typeof EditEqualityContentInput, value: object) =>
  pipe.transform(value, { type: 'body', metatype })

describe.each([
  ['UpdateEqualityDraftContentInput', UpdateEqualityDraftContentInput],
  ['EditEqualityContentInput', EditEqualityContentInput],
])('%s', (_, metatype) => {
  it('accepts HTML content with no key', async () => {
    await expect(
      validate(metatype, {
        applicationId: 'app',
        equalityReportContent: 'PHA+w4FldGx1bjwvcD4=',
      }),
    ).resolves.toBeDefined()
  })

  it('accepts an inline PDF with no key, as old browser tabs send', async () => {
    await expect(
      validate(metatype, {
        applicationId: 'app',
        equalityReportPdf: 'JVBERi0xLjc=',
        equalityReportPdfFilename: 'aaetlun.pdf',
      }),
    ).resolves.toBeDefined()
  })

  it('accepts a null key', async () => {
    await expect(
      validate(metatype, {
        applicationId: 'app',
        equalityReportContent: 'PHA+w4FldGx1bjwvcD4=',
        equalityReportPdfKey: null,
      }),
    ).resolves.toBeDefined()
  })

  it('accepts a key with its filename', async () => {
    await expect(
      validate(metatype, {
        applicationId: 'app',
        equalityReportPdfKey: 'presigned-plan-key',
        equalityReportPdfFilename: 'aaetlun.pdf',
      }),
    ).resolves.toBeDefined()
  })

  it('rejects a key over 256 characters', async () => {
    await expect(
      validate(metatype, {
        applicationId: 'app',
        equalityReportPdfKey: 'k'.repeat(257),
        equalityReportPdfFilename: 'aaetlun.pdf',
      }),
    ).rejects.toThrow()
  })
})
