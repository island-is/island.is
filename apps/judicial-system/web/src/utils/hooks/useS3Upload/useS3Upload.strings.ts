import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  uploadFailed: {
    id: 'judicial.system.core:use_s3_upload.upload_failed',
    defaultMessage: 'Ekki tókst að hlaða upp skjali',
    description:
      'Notaður sem villuskilaboð þegar ekki tekst að hlaða upp skjali',
  },
  removeFailed: {
    id: 'judicial.system.core:use_s3_upload.remove_failed',
    defaultMessage: 'Ekki tókst að eyða skjali',
    description: 'Notaður sem villuboð þegar ekki tekst að eyða skjali.',
  },
})
