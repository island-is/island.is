import { defineMessage, defineMessages } from 'react-intl'

export const strings = {
  heading: defineMessage({
    id: 'judicial.system.core:police_case_files_route.heading',
    defaultMessage: 'Málsgögn',
    description: 'Notaður sem titill á Málsgögn skrefi í ákærum.',
  }),
  infoBox: defineMessage({
    id: 'judicial.system.core:police_case_files_route.info_box',
    defaultMessage:
      'Gögn sem er hlaðið upp hér fyrir neðan verða sameinuð í eitt PDF skjal og efnisyfirlit sjálfkrafa búið til.',
    description: 'Notaður sem texti í info boxi í Málsgögn skrefi í ákærum.',
  }),
  policeCaseNumberSectionHeading: defineMessage({
    id: 'judicial.system.core:police_case_files_route.police_case_number_section_heading',
    defaultMessage: 'Gögn úr LÖKE-máli {policeCaseNumber}',
    description:
      'Notaður sem fyrirsögn fyrir hvert Löke númer á Málsgögn skrefi í ákærum.',
  }),
  inputFileUpload: defineMessages({
    header: {
      id: 'judicial.system.core:police_case_files_route.input_file_upload.header',
      defaultMessage: 'Dragðu skrár hingað til að hlaða upp',
      description:
        'Notaður fyrir texta í svæði sem hægt er að draga skrá á til að hlaða þeim upp.',
    },
    description: {
      id: 'judicial.system.core:police_case_files_route.input_file_upload.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description:
        'Notaður fyrir hjálpar texta í svæði sem hægt er að draga skrá á til að hlaða þeim upp.',
    },
    buttonLabel: {
      id: 'judicial.system.core:police_case_files_route.input_file_upload.button_label',
      defaultMessage: 'Velja gögn til að hlaða upp',
      description:
        'Notaður fyrir texta í takka sem hægt er að ýta á til að velja skrár til að hlaða upp.',
    },
  }),
}
