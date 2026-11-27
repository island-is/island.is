import {
  FamilyTypes,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/shared'
import PDFDocument from 'pdfkit'
import { ApplicationDto } from '../app/modules/applications/models/dto/application.dto'
import { buildApplicationPdf } from './applicationPdf'
import { FieldDto } from '../app/modules/fields/models/dto/field.dto'
import { ScreenDto } from '../app/modules/screens/models/dto/screen.dto'
import { SectionDto } from '../app/modules/sections/models/dto/section.dto'

describe('buildApplicationPdf layout', () => {
  afterEach(() => jest.restoreAllMocks())

  const applicationWithFields = (fields: FieldDto[]): ApplicationDto => ({
    formName: { is: 'Fallback form name', en: '' },
    sections: [
      Object.assign(new SectionDto(), {
        sectionType: SectionTypes.INPUT,
        screens: [Object.assign(new ScreenDto(), { fields })],
      }),
    ],
  })

  it.each([1, 2])(
    'renders %s multiset groups in summary order with one number per group',
    async (itemCount) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')
      const field = (name: string, values: string[], repeated = false) =>
        Object.assign(new FieldDto(), {
          id: name,
          name: { is: name },
          fieldType: FieldTypesEnum.TEXTBOX,
          isPartOfMultiset: repeated,
          values: values.map((text) => ({ json: { text } })),
        })
      const firstAnswers = Array.from(
        { length: itemCount },
        (_, index) => `First answer ${index + 1}`,
      )
      const secondAnswers = Array.from(
        { length: itemCount },
        (_, index) => `Second answer ${index + 1}`,
      )
      const application = applicationWithFields([
        Object.assign(new FieldDto(), {
          fieldType: FieldTypesEnum.MESSAGE,
          isPartOfMultiset: true,
          informationText: { is: 'Original message content' },
          values: Array.from({ length: 3 }, () => ({ json: {} })),
        }),
        field('Before', ['Before answer']),
        field('First field', firstAnswers, true),
        field('Standalone field', ['Only once']),
        field('Second field', secondAnswers, true),
        field('After', ['After answer']),
      ])
      const screen = application.sections?.[0]?.screens?.[0]
      if (!screen) throw new Error('Missing screen fixture')
      screen.isMulti = true

      await buildApplicationPdf(application)

      const expected = [
        'Before',
        'Before answer',
        ...firstAnswers.flatMap((answer, index) => [
          ...(itemCount > 1 ? [`${index + 1}.`] : []),
          'First field',
          answer,
          'Second field',
          secondAnswers[index],
        ]),
        'Standalone field',
        'Only once',
        'After',
        'After answer',
      ]
      const relevant = new Set(expected)
      expect(
        text.mock.calls
          .map(([value]) => value)
          .filter(
            (value) =>
              typeof value === 'string' &&
              (relevant.has(value) || /^\d+\.\s*$/.test(value)),
          ),
      ).toEqual(expected)
      expect(
        text.mock.calls.filter(
          ([value]) => value === 'Original message content',
        ),
      ).toHaveLength(1)
      expect(text.mock.calls.map(([value]) => value)).not.toContain('1. ')
    },
  )

  it('omits hidden dependent multiset answers from the PDF', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')
    const application = applicationWithFields([
      Object.assign(new FieldDto(), {
        id: 'parent',
        fieldType: FieldTypesEnum.CHECKBOX,
        isPartOfMultiset: true,
        values: [
          { json: { checkboxValue: false } },
          { json: { checkboxValue: true } },
        ],
      }),
      Object.assign(new FieldDto(), {
        id: 'child',
        name: { is: 'Answers' },
        fieldType: FieldTypesEnum.TEXTBOX,
        isPartOfMultiset: true,
        values: [
          { json: { text: 'Hidden answer' } },
          { json: { text: 'Visible answer' } },
        ],
      }),
    ])
    const screen = application.sections?.[0]?.screens?.[0]
    if (!screen) throw new Error('Missing screen fixture')
    screen.isMulti = true
    application.dependencies = [
      { parentProp: 'parent', childProps: ['child'], isSelected: true },
    ]

    await buildApplicationPdf(application)
    const content = text.mock.calls.map(([value]) => value)
    expect(content).toContain('Visible answer')
    expect(content).not.toContain('Hidden answer')
  })

  it.each([FieldTypesEnum.FAMILY, FieldTypesEnum.CHILD])(
    'separates children with a blank line and no numbering for %s fields',
    async (fieldType) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')
      const height = jest.spyOn(PDFDocument.prototype, 'heightOfString')
      await buildApplicationPdf(
        applicationWithFields([
          Object.assign(new FieldDto(), {
            name: { is: 'Children' },
            fieldType,
            fieldSettings: { familyType: FamilyTypes.CHILD },
            values: [
              { json: {} },
              { json: { name: 'First child', nationalId: '0101232989' } },
              { json: {} },
              { json: { name: 'Second child', nationalId: '0101212989' } },
              { json: {} },
            ],
          }),
        ]),
      )

      const expected =
        'Nafn: First child\nKennitala: 0101232989\n\nNafn: Second child\nKennitala: 0101212989'
      expect(text.mock.calls.map(([value]) => value)).toContain(expected)
      expect(height.mock.calls.map(([value]) => value)).toContain(expected)
      expect(
        text.mock.calls.some(
          ([value]) => typeof value === 'string' && /^\d+\. /.test(value),
        ),
      ).toBe(false)
    },
  )

  it('keeps numbering for repeated values in other fields', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')
    await buildApplicationPdf(
      applicationWithFields([
        Object.assign(new FieldDto(), {
          name: { is: 'Answers' },
          fieldType: FieldTypesEnum.TEXTBOX,
          values: [
            { json: { text: 'First answer' } },
            { json: { text: 'Second answer' } },
          ],
        }),
      ]),
    )

    expect(text.mock.calls.map(([value]) => value)).toEqual(
      expect.arrayContaining(['1. ', 'First answer', '2. ', 'Second answer']),
    )
  })

  it.each(['', ' \n ', undefined])(
    'does not fall back to another language for empty field content: %j',
    async (translation) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')
      await buildApplicationPdf(
        applicationWithFields([
          Object.assign(new FieldDto(), {
            name: { is: 'Fallback field name' },
            fieldType: FieldTypesEnum.CHECKBOX,
            informationText: { is: 'Hidden instructions', en: translation },
            fieldSettings: {
              subLabel: { is: 'Hidden sublabel', en: translation },
            },
          }),
          Object.assign(new FieldDto(), {
            name: { is: 'Fallback message name' },
            fieldType: FieldTypesEnum.MESSAGE,
            informationText: { is: 'Hidden message', en: translation },
          }),
        ]),
        'en',
      )

      const content = text.mock.calls.map(([value]) => value)
      expect(content).toContain('Fallback form name')
      expect(content).toContain('Fallback field name')
      expect(content).toContain('Fallback message name')
      expect(content).not.toContain('Hidden instructions')
      expect(content).not.toContain('Hidden sublabel')
      expect(content).not.toContain('Hidden message')
    },
  )

  it.each([FieldTypesEnum.MESSAGE, FieldTypesEnum.TEXTBOX])(
    'decodes nested formatting and entities before measuring and rendering %s information',
    async (fieldType) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')
      const height = jest.spyOn(PDFDocument.prototype, 'heightOfString')
      const markup =
        '<strong>First <em>nested &amp; emphasized</em></strong>\n\n<em>&lt;Second&gt; &#169;</em>'
      const expected = 'First nested & emphasized\n\n<Second> ©'
      await buildApplicationPdf(
        applicationWithFields([
          Object.assign(new FieldDto(), {
            name: { is: 'Field' },
            fieldType,
            informationText: { is: markup },
          }),
        ]),
      )

      expect(text.mock.calls.map(([value]) => value)).toContain(expected)
      expect(height.mock.calls.map(([value]) => value)).toContain(expected)
      expect(text.mock.calls.map(([value]) => value)).not.toContain(markup)
      expect(height.mock.calls.map(([value]) => value)).not.toContain(markup)
    },
  )

  it('includes information and checkbox sublabels, renders message bodies once, and omits tooltips', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')
    await buildApplicationPdf({
      sections: [
        Object.assign(new SectionDto(), {
          name: { is: 'Section' },
          sectionType: SectionTypes.INPUT,
          screens: [
            Object.assign(new ScreenDto(), {
              name: { is: 'Screen' },
              fields: [
                Object.assign(new FieldDto(), {
                  name: { is: 'Input' },
                  fieldType: FieldTypesEnum.CHECKBOX,
                  informationText: { is: 'Instructions' },
                  tooltip: { is: 'Tooltip help' },
                  fieldSettings: {
                    isLarge: true,
                    subLabel: { is: 'Sublabel' },
                  },
                  values: [{ json: { checkboxValue: true } }],
                }),
                Object.assign(new FieldDto(), {
                  name: { is: 'Message' },
                  fieldType: FieldTypesEnum.MESSAGE,
                  informationText: { is: 'Message body' },
                }),
                Object.assign(new FieldDto(), {
                  name: { is: 'Applicant' },
                  fieldType: FieldTypesEnum.APPLICANT,
                  informationText: { is: 'Excluded applicant instructions' },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const content = text.mock.calls.map(([value]) => value)
    expect(content).toContain('Instructions')
    expect(content).toContain('Input\nSublabel')
    expect(content.filter((value) => value === 'Message body')).toHaveLength(1)
    expect(content).not.toContain('Tooltip help')
    expect(content).not.toContain('Excluded applicant instructions')
  })

  it.each(['is', 'en'] as const)(
    'places the checkbox sublabel beneath its name with matching font and measured spacing in %s',
    async (locale) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')
      const height = jest.spyOn(PDFDocument.prototype, 'heightOfString')
      const font = jest.spyOn(PDFDocument.prototype, 'font')
      const fontSize = jest.spyOn(PDFDocument.prototype, 'fontSize')
      const name = { is: 'Checkbox', en: 'English checkbox' }
      const subLabel = {
        is: 'First line\nSecond line',
        en: 'English first line\nEnglish second line',
      }
      await buildApplicationPdf(
        applicationWithFields([
          Object.assign(new FieldDto(), {
            name,
            fieldType: FieldTypesEnum.CHECKBOX,
            isRequired: true,
            fieldSettings: { isLarge: true, subLabel },
            values: [{ json: { checkboxValue: true } }],
          }),
        ]),
        locale,
      )

      const label = `${name[locale]} *\n${subLabel[locale]}`
      const labelIndex = text.mock.calls.findIndex(([value]) => value === label)
      const heightIndex = height.mock.calls.findIndex(
        ([value]) => value === label,
      )
      expect(labelIndex).toBeGreaterThanOrEqual(0)
      expect(heightIndex).toBeGreaterThanOrEqual(0)
      for (const order of [
        text.mock.invocationCallOrder[labelIndex],
        height.mock.invocationCallOrder[heightIndex],
      ]) {
        expect(
          font.mock.calls
            .filter((_, index) => font.mock.invocationCallOrder[index] < order)
            .pop(),
        ).toEqual(['Helvetica-Bold'])
        expect(
          fontSize.mock.calls
            .filter(
              (_, index) => fontSize.mock.invocationCallOrder[index] < order,
            )
            .pop(),
        ).toEqual([9])
      }
      const labelCall = text.mock.calls[labelIndex]
      const valueCall = text.mock.calls[labelIndex + 1]
      expect(valueCall[1]).toBe(labelCall[1])
      expect(Number(valueCall[2])).toBeCloseTo(
        Number(labelCall[2]) +
          Number(height.mock.results[heightIndex].value) +
          6,
      )
      expect(text.mock.calls.map(([value]) => value)).not.toContain(
        subLabel[locale],
      )
    },
  )

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
