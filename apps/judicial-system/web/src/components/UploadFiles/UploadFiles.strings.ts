import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  heading: {
    id: 'judicial.system.core:upload_files.heading',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description:
      'Notaður sem titill í hlaða upp skjölum hluta á Gögn síðu í ákærum.',
  },
  acceptFiles: {
    id: 'judicial.system.core:upload_files.accept_files',
    defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
    description:
      'Notaður sem texti til að tilkynna að aðeins .pdf skjöl eru leyfð.',
  },
  buttonText: {
    id: 'judicial.system.core:upload_files.button_text',
    defaultMessage: 'Velja skjöl til að hlaða upp',
    description: 'Notaður sem texti á takka til að velja skjölum.',
  },
  invalidDateErrorMessage: {
    id: 'judicial.system.core:upload_files.invalid_date_error_message',
    defaultMessage:
      'Ekki tókst að uppfæra skjal, dagsetning er ekki á réttu formi',
    description:
      'Notaður sem villuboð þegar tekst ekki að uppfæra dagsetningu á skjali.',
  },
  renameFailedErrorMessage: {
    id: 'judicial.system.core:upload_files.rename_failed_error_message',
    defaultMessage: 'Ekki tókst að endurnefna skjal',
    description: 'Notaður sem villuboð þegar endurnefning á skjali mistókst.',
  },
})
