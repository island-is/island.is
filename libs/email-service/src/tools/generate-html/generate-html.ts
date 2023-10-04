import fs from 'fs'
import { join } from 'path'
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

  let replacedHtml = html

  attachments.forEach((attachment) => {
    replacedHtml = replacedHtml.replace(
      `"cid:${attachment.cid}"`,
      `data:image/jpg;${attachment.encoding},${attachment.content}`,
    )
  })

  const output = join(__dirname, 'output/output.html')

  await writeFile(output, replacedHtml, {
    encoding: 'utf-8',
  })

  console.log(`File generated: ${output}`)
  process.exit(0)
}

generate()
