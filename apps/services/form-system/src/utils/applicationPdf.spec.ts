import { SectionTypes } from '@island.is/form-system/shared'
import PDFDocument from 'pdfkit'
import { ApplicationDto } from '../app/modules/applications/models/dto/application.dto'
import { buildApplicationPdf } from './applicationPdf'

describe('buildApplicationPdf layout', () => {
  afterEach(() => jest.restoreAllMocks())

  it.each([
    {
      locale: 'is' as const,
      label: 'Númer',
      pageLabel: 'Bls.',
      receivedLabel: 'Móttekin',
    },
    {
      locale: 'en' as const,
      label: 'number',
      pageLabel: 'Page',
      receivedLabel: 'Received',
    },
  ])(
    'keeps page numbers on every page and the application number only on the last page in $locale',
    async ({ locale, label, pageLabel, receivedLabel }) => {
      const originalText = PDFDocument.prototype.text
      const titlePositions: number[] = []
      const applicationNumberPages: PDFKit.PDFDocument['page'][] = []
      const pageNumberPages: PDFKit.PDFDocument['page'][] = []
      const text = jest
        .spyOn(PDFDocument.prototype, 'text')
        .mockImplementation(function (this: PDFKit.PDFDocument, ...args) {
          if (args[0] === (locale === 'en' ? 'Application' : 'Umsókn')) {
            titlePositions.push(this.y)
          }
          if (typeof args[0] === 'string' && args[0].startsWith(`${label}:`)) {
            applicationNumberPages.push(this.page)
          }
          if (
            typeof args[0] === 'string' &&
            new RegExp(`^${pageLabel.replace('.', '\\.')} \\d+$`).test(args[0])
          ) {
            pageNumberPages.push(this.page)
          }
          return originalText.apply(this, args)
        })
      const image = jest.spyOn(PDFDocument.prototype, 'image')
      const roundedRect = jest.spyOn(PDFDocument.prototype, 'roundedRect')
      const logo = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
        'base64',
      )
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

      const pdf = await buildApplicationPdf(application, locale, logo)
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
      const organizationNames = text.mock.calls.filter(
        ([value]) => value === (locale === 'en' ? 'Organization' : 'Stofnun'),
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
      expect(image).toHaveBeenCalledTimes(1)
      expect(image.mock.invocationCallOrder[0]).toBeLessThan(
        text.mock.invocationCallOrder[text.mock.calls.indexOf(pageNumbers[0])],
      )
      expect(titlePositions).toEqual([128])
      for (const call of image.mock.calls) {
        expect(call[0]).toBe(logo)
        expect(call[1]).toBeCloseTo(595.28 - 56 - 120)
        expect(call[2]).toBe(56)
        expect(call[3]).toEqual({
          fit: [120, 60],
          align: 'right',
        })
      }
      for (const call of roundedRect.mock.calls) {
        expect(call[1]).toBeGreaterThanOrEqual(128)
      }
      expect(applicationNumbers).toHaveLength(1)
      expect(applicationNumberPages).toEqual([
        pageNumberPages[pageNumberPages.length - 1],
      ])
      expect(organizationNames).toHaveLength(1)
      expect(organizationNames[0][1]).toBe(56)
      expect(organizationNames[0][2]).toBeGreaterThan(titlePositions[0] + 20)
      expect(organizationNames[0][3]).toEqual({
        width: 483,
        align: 'left',
      })
      expect(receivedDates).toHaveLength(1)
      expect(receivedDates[0][0]).toBe(receivedText)
      expect(receivedDates[0][1]).toBe(organizationNames[0][1])
      expect(receivedDates[0][2]).toBeGreaterThan(
        Number(organizationNames[0][2]),
      )
      expect(receivedDates[0][3]).toEqual(organizationNames[0][3])
      expect(footerReceivedDates).toHaveLength(0)
      expect(
        text.mock.calls.filter(
          (call) => typeof call[2] === 'number' && call[2] > 700,
        ),
      ).toHaveLength(pageNumbers.length + 1)
      expect(applicationNumbers[0][0]).toBe(`${label}: ${application.id}`)
      expect(applicationNumbers[0][2]).toBeGreaterThan(700)
      expect(applicationNumbers[0][2]).toBe(
        Number(pageNumbers[pageNumbers.length - 1][2]),
      )
    },
  )

  it('omits the received date when the application has not been submitted', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')
    const image = jest.spyOn(PDFDocument.prototype, 'image')

    const pdf = await buildApplicationPdf({ id: 'application-id' })

    expect(
      text.mock.calls.some(
        ([value]) => typeof value === 'string' && value.startsWith('Móttekin:'),
      ),
    ).toBe(false)
    expect(image).not.toHaveBeenCalled()
    expect(pdf.toString('latin1').match(/\/Type \/Page\b/g) ?? []).toHaveLength(
      1,
    )
    expect(
      text.mock.calls.filter(([value]) => value === 'Númer: application-id'),
    ).toHaveLength(1)
  })
})
