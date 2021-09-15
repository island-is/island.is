import fs from 'fs'
import util from 'util'

const WriteFile = util.promisify(fs.writeFile)

export const writeFile = async (jsonContent: string) => {
  await WriteFile('./homestatic.json', jsonContent)
}
