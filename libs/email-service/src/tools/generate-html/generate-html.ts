import { join } from 'path'
import fs from 'fs'
import util from 'util'
import { createTestingEmailModule } from '../../lib/test/createTestingEmailModule'
import { AdapterService } from '../adapter.service'
import example from './example'

const writeFile = util.promisify(fs.writeFile)

async function generate() {
  const module = await createTestingEmailModule()

  const adapterService = module.get(AdapterService)

  const { html, attachments } = await adapterService.buildCustomTemplate({
    title: 'example',
    body: example,
  })

  let replacedHtml = ''

  attachments.forEach((attachment) => {
    replacedHtml = html.replace(
      `"cid:${attachment.cid}"`,
      `data:image/jpg;${attachment.encoding},${attachment.content}`,
    )
  })

  await writeFile(join(__dirname, 'output/output.html'), replacedHtml, {
    encoding: 'utf-8',
  })

  process.exit(0)
}

generate()
