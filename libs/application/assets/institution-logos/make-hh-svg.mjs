import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tsxPath = path.join(
  __dirname,
  'HeilsugaeslaHofudborgarsvaedisinsLogo.tsx',
)
const svgPath = path.join(
  __dirname,
  'svg',
  'HeilsugaeslaHofudborgarsvaedisinsLogo.svg',
)

const tsx = fs.readFileSync(tsxPath, 'utf8')
const match = tsx.match(/`(data:image\/png;base64,[^`]+)`/)
if (!match) {
  console.error('Could not find base64 data')
  process.exit(1)
}

const dataURI = match[1]
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500" viewBox="0 0 500 500">
  <image width="500" height="500" xlink:href="${dataURI}"/>
</svg>
`

fs.writeFileSync(svgPath, svg, 'utf8')
console.log('Created: svg/HeilsugaeslaHofudborgarsvaedisinsLogo.svg')
