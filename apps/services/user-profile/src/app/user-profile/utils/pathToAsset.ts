import { join } from 'path'

export const pathToAsset = (file: string) => {
  return join(__dirname, `./assets/images/${file}`)
}
