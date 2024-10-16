import { defineMessage } from 'react-intl'

export const strings = {
  simpleInputPlaceholder: defineMessage({
    id: 'judicial.system.core:editable_case_file.simple_input_placeholder',
    defaultMessage: 'Skráðu inn heiti á skjali',
    description:
      'Notaður sem skýritexti í textasvæði reit til að breyta heiti skjals.',
  }),
  invalidFilenameErrorMessage: {
    id: 'judicial.system.core:editable_case_file.invalid_filename_error_message',
    defaultMessage: 'Ekki tókst að uppfæra skjal, heiti er tómt',
    description:
      'Notaður sem villuboð þegar tekst ekki að uppfæra heiti á skjali.',
  },
  invalidDateErrorMessage: {
    id: 'judicial.system.core:editable_case_file.invalid_date_error_message',
    defaultMessage:
      'Ekki tókst að uppfæra skjal, dagsetning er ekki á réttu formi',
    description:
      'Notaður sem villuboð þegar tekst ekki að uppfæra dagsetningu á skjali.',
  },
}
