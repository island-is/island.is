import { debuglog } from 'util'
import fs from 'fs'
import { getLogger } from '../../../../infra/src/logging'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const logger = getLogger()
export const debug = logger.debug

export const createMockPdf = () => {
  fs.writeFile('./mockPdf.pdf', 'test', (e) => {
    throw e
  })
}

export const deleteMockPdf = () => {
  fs.unlink('./mockPdf.pdf', (err) => {
    if (err) throw err
    logger.debug('Successfully deleted mockPdf file.')
  })
}
