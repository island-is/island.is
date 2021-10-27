import fs from 'fs'

export function writeFile(fileName: string, documentContent: string | Buffer) {
  // In e2e tests, fs is null and we have not been able to mock fs
  const dir = './tmp'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  fs?.writeFileSync(`${dir}/${fileName}`, documentContent, {
    encoding: 'binary',
  })
}
