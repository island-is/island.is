import { debuglog } from 'util'
import fs from 'fs'

/**
 * Pauses the execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified duration.
 */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * Creates a mock PDF file named 'mockPdf.pdf' with the content 'test'.
 *
 * @throws Will throw an error if the file write operation fails.
 */
export const createMockPdf = () => {
  fs.writeFile('./mockPdf.pdf', 'test', (e) => {
    throw e
  })
}

/**
 * Deletes the mock PDF file located at './mockPdf.pdf'.
 *
 * This function attempts to delete the file and logs a success message upon completion.
 * If an error occurs during the deletion process, it throws an error.
 *
 * @throws Will throw an error if the file deletion fails.
 */
export const deleteMockPdf = () => {
  fs.unlink('./mockPdf.pdf', (err) => {
    if (err) throw err
    debug('Successfully deleted mockPdf file.')
  })
}

/**
 * Logs a debug message with the specified arguments.
 * Set NODE_DEBUG=system-e2e in your environment when testing to show debug messages.
 *
 * @param msg - The message to log.
 * @param args - Additional arguments to log.
 */
export const debug = (msg: string, ...args: unknown[]) => {
  debuglog('system-e2e')(msg, ...args)
}
