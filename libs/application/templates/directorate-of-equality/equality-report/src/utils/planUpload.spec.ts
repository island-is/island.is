/**
 * @jest-environment node
 */
import JSZip from 'jszip'
import {
  EQUALITY_PLAN_REJECTED,
  MAX_INLINE_BASE64_LENGTH,
  convertDocxToHtml,
  isPlanRejection,
} from './planUpload'

// The form runs mammoth's browser build, whose unzip reads `arrayBuffer`;
// jest resolves the Node build, which only reads `path` or `buffer`.
jest.mock('mammoth/lib/unzip', () =>
  jest.requireActual('mammoth/browser/unzip'),
)

// The island.is API's jsonBodyLimit, '350kb' in body-parser's units.
const API_JSON_BODY_LIMIT = 350 * 1024

// 1x1 transparent PNG, padded so a leak into the output would be obvious.
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
const R_NS =
  'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

const paragraph = (text: string) => `<w:p><w:r><w:t>${text}</w:t></w:r></w:p>`

const inlineImage = (relId: string) => `
<w:p><w:r><w:drawing>
  <wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
    <wp:extent cx="9525" cy="9525"/>
    <wp:docPr id="1" name="Mynd" descr="graf"/>
    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
      <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
        <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
          <pic:nvPicPr><pic:cNvPr id="0" name="image1.png"/><pic:cNvPicPr/></pic:nvPicPr>
          <pic:blipFill><a:blip r:embed="${relId}"/></pic:blipFill>
          <pic:spPr/>
        </pic:pic>
      </a:graphicData>
    </a:graphic>
  </wp:inline>
</w:drawing></w:r></w:p>`

const buildDocx = async (body: string, images: string[] = []) => {
  const zip = new JSZip()
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  )
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="${R_NS}/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  )
  zip.file(
    'word/_rels/document.xml.rels',
    `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${images
  .map(
    (relId, index) =>
      `  <Relationship Id="${relId}" Type="${R_NS}/image" Target="media/image${index}.png"/>`,
  )
  .join('\n')}
</Relationships>`,
  )
  images.forEach((_, index) =>
    zip.file(`word/media/image${index}.png`, PNG_BASE64, { base64: true }),
  )
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="${W_NS}" xmlns:r="${R_NS}"><w:body>${body}</w:body></w:document>`,
  )
  return zip.generateAsync({ type: 'arraybuffer' })
}

describe('convertDocxToHtml', () => {
  it('converts text and reports no images', async () => {
    const docx = await buildDocx(paragraph('Markmið') + paragraph('Aðgerðir'))

    const { html, imageCount } = await convertDocxToHtml(docx)

    expect(html).toBe('<p>Markmið</p><p>Aðgerðir</p>')
    expect(imageCount).toBe(0)
  })

  it('leaves images out, keeps the text and counts them', async () => {
    const docx = await buildDocx(
      paragraph('Markmið') +
        inlineImage('rIdImg1') +
        paragraph('Aðgerðir') +
        inlineImage('rIdImg2'),
      ['rIdImg1', 'rIdImg2'],
    )

    const { html, imageCount } = await convertDocxToHtml(docx)

    expect(imageCount).toBe(2)
    expect(html).not.toContain('<img')
    expect(html).not.toContain('data:')
    expect(html).toContain('<p>Markmið</p>')
    expect(html).toContain('<p>Aðgerðir</p>')
  })
})

describe('inline size cap', () => {
  it('stays under the API body limit', () => {
    expect(MAX_INLINE_BASE64_LENGTH).toBeLessThan(API_JSON_BODY_LIMIT)
  })
})

describe('isPlanRejection', () => {
  const withTitle = (title: unknown) => ({
    graphQLErrors: [{ extensions: { problem: { title } } }],
  })

  it('recognises the API refusal title', () => {
    expect(isPlanRejection(withTitle(EQUALITY_PLAN_REJECTED))).toBe(true)
  })

  it('ignores other errors', () => {
    expect(isPlanRejection(withTitle('DoeEqualityAttachmentRejected'))).toBe(
      false,
    )
    expect(isPlanRejection(new Error('network'))).toBe(false)
    expect(isPlanRejection(undefined)).toBe(false)
  })
})
