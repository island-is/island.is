import { SectionTypes } from '@island.is/form-system/shared'
import PDFDocument from 'pdfkit'
import { ApplicationDto } from '../app/modules/applications/models/dto/application.dto'
import { buildApplicationPdf } from './applicationPdf'

describe('buildApplicationPdf footer', () => {
  afterEach(() => jest.restoreAllMocks())

  it.each([
    {
      locale: 'is' as const,
      label: 'Númer umsóknar',
      pageLabel: 'Bls.',
      receivedLabel: 'Móttekin',
    },
    {
      locale: 'en' as const,
      label: 'Application number',
      pageLabel: 'Page',
      receivedLabel: 'Received',
    },
  ])(
    'prints the received date only in every footer in $locale',
    async ({ locale, label, pageLabel, receivedLabel }) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')
      const application: ApplicationDto = {
        id: '12345678-1234-1234-1234-123456789012',
        formName: { is: 'Umsókn', en: 'Application' },
        organizationName: { is: 'Stofnun', en: 'Organization' },
        submittedAt: new Date('2026-11-13T10:00:00Z'),
        sections: Array.from({ length: 20 }, (_, index) => ({
          id: `section-${index}`,
          name: { is: `Kafli ${index}`, en: `Section ${index}` },
          sectionType: SectionTypes.PARTIES,
          displayOrder: index,
          isHidden: false,
          isCompleted: true,
        })),
      }

      const pdf = await buildApplicationPdf(application, locale)
      const pageNumbers = text.mock.calls.filter(
        ([value]) =>
          typeof value === 'string' &&
          new RegExp(`^${pageLabel.replace('.', '\\.')} \\d+$`).test(value),
      )
      const applicationNumbers = text.mock.calls.filter(
        ([value]) => typeof value === 'string' && value.startsWith(`${label}:`),
      )
      const receivedDates = text.mock.calls.filter(
        ([value]) =>
          typeof value === 'string' && value.startsWith(`${receivedLabel}:`),
      )
      const footerReceivedDates = receivedDates.filter(
        (call) => typeof call[2] === 'number' && call[2] > 700,
      )
      const receivedText = `${receivedLabel}: ${new Date(
        '2026-11-13T10:00:00Z',
      ).toLocaleString(locale === 'en' ? 'en-GB' : 'is-IS')}`

      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
      expect(pageNumbers.length).toBeGreaterThan(1)
      expect(pageNumbers).toHaveLength(
        (pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).length,
      )
      expect(applicationNumbers).toHaveLength(pageNumbers.length)
      expect(receivedDates).toHaveLength(pageNumbers.length)
      expect(footerReceivedDates).toHaveLength(pageNumbers.length)
      for (const [index, call] of applicationNumbers.entries()) {
        expect(call[0]).toBe(`${label}: ${application.id}`)
        expect(call[2]).toBeGreaterThan(700)
        expect(call[2]).toBe(Number(pageNumbers[index][2]) + 12)
        expect(footerReceivedDates[index][0]).toBe(receivedText)
        expect(footerReceivedDates[index][1]).toBe(call[1])
        expect(footerReceivedDates[index][2]).toBe(Number(call[2]) + 12)
      }
    },
  )

  it('omits the received date when the application has not been submitted', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')

    await buildApplicationPdf({ id: 'application-id' })

    expect(
      text.mock.calls.some(
        ([value]) => typeof value === 'string' && value.startsWith('Móttekin:'),
      ),
    ).toBe(false)
  })
})
