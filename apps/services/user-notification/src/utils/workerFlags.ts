import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

export const birthdayFlag = () =>
  yargs(hideBin(process.argv))
    .option('isBirthdayWorker', {
      boolean: true,
      description:
        'Indicates to the user-notification that a worker type is for birthday notifications',
    })
    .parseSync().isBirthdayWorker
