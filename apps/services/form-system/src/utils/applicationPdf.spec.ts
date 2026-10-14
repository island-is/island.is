import axios from 'axios'
import PDFDocument from 'pdfkit'
import { ApplicationDto } from '../app/modules/applications/models/dto/application.dto'
import { buildApplicationPdf } from './applicationPdf'

jest.mock('axios')

describe('application PDF organization header', () => {
  const application = {
    id: 'application-id',
    formName: { is: 'Application title' },
    organizationName: {
      is: 'Application organization',
      en: 'English application organization',
    },
  } as ApplicationDto
  const organization = {
    name: { is: 'Icelandic organization', en: 'English organization' },
    logo: 'https://images.ctfassets.net/organization.png',
  }

  afterEach(() => jest.restoreAllMocks())

  it('places a larger logo to the right of the title and keeps the organization name only in the footer', async () => {
    const logo = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
      'base64',
    )
    jest.mocked(axios.get).mockResolvedValue({ data: logo })
    const text = jest.spyOn(PDFDocument.prototype, 'text')
    const image = jest.spyOn(PDFDocument.prototype, 'image')

    const pdf = await buildApplicationPdf(application, 'en', organization)

    expect(pdf.subarray(0, 4).toString()).toBe('%PDF')
    expect(text).toHaveBeenCalledWith('Application title', 56, 56, {
      width: 367,
    })
    expect(image).toHaveBeenCalledWith(logo, 443, 56, {
      fit: [96, 96],
      align: 'right',
    })
    const organizationCalls = text.mock.calls.filter(
      ([name]) => name === 'English application organization',
    )
    expect(organizationCalls).toHaveLength(1)
    expect(organizationCalls[0][2]).toBeGreaterThan(700)
  })

  it('still generates a PDF with the organization name when the logo request fails', async () => {
    jest.mocked(axios.get).mockRejectedValue(new Error('Unavailable'))
    const text = jest.spyOn(PDFDocument.prototype, 'text')

    await expect(
      buildApplicationPdf(application, 'is', organization),
    ).resolves.toBeInstanceOf(Buffer)
    expect(text).toHaveBeenCalledWith('Application title', 56, 56, {
      width: 483,
    })
    expect(text).toHaveBeenCalledWith(
      'Application organization',
      56,
      expect.any(Number),
    )
  })

  it('uses the application organization name without metadata', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')

    await buildApplicationPdf(application)

    expect(text).toHaveBeenCalledWith(
      'Application organization',
      56,
      expect.any(Number),
    )
  })

  it.each([undefined, { is: '', en: '' }])(
    'falls back to the stored organization name when the application name is %p',
    async (organizationName) => {
      const text = jest.spyOn(PDFDocument.prototype, 'text')

      await buildApplicationPdf({ ...application, organizationName }, 'en', {
        name: organization.name,
      })

      expect(text).toHaveBeenCalledWith(
        'English organization',
        56,
        expect.any(Number),
      )
    },
  )

  it('uses the localized organization name instead of the form title in every page footer', async () => {
    const text = jest.spyOn(PDFDocument.prototype, 'text')
    const addPage = jest.spyOn(PDFDocument.prototype, 'addPage')
    const multiPageApplication = {
      ...application,
      sections: Array.from({ length: 20 }, () => ({
        name: { is: 'Section' },
      })),
    } as ApplicationDto

    await buildApplicationPdf(multiPageApplication, 'en', {
      name: organization.name,
    })

    const footerCalls = text.mock.calls.filter(
      ([, positionX, positionY]) =>
        positionX === 56 && typeof positionY === 'number' && positionY > 700,
    )
    expect(footerCalls.length).toBeGreaterThan(1)
    expect(footerCalls).toHaveLength(addPage.mock.calls.length)
    expect(
      footerCalls.every(
        ([name]) => name === 'English application organization',
      ),
    ).toBe(true)
  })

  it('ignores unsupported logo data', async () => {
    jest.mocked(axios.get).mockResolvedValue({ data: Buffer.from('<svg/>') })

    await expect(
      buildApplicationPdf(application, 'is', organization),
    ).resolves.toBeInstanceOf(Buffer)
  })
})
