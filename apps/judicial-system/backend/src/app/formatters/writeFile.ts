import fs from 'fs'

export function writeFile(fileName: string, documentContent: string | Buffer) {
  // In e2e tests, fs is null and we have not been able to mock fs
  fs?.writeFileSync(`../${fileName}`, documentContent, { encoding: 'binary' })
}
