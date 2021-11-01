import { defineMessages } from 'react-intl'

export const caseFiles = {
  modal: {
    fileNotFound: defineMessages({
      title: {
        id: 'judicial.system.core:modalfile_not_found.title',
        defaultMessage: 'Skjalið er ekki lengur aðgengilegt í Réttarvörslugátt',
        description:
          'Notaður sem titill fyrir popup glugga sem segir að skjal sé ekki lengur aðgengilegt í RVG þegar reynt er að opna það',
      },
      text: {
        id: 'judicial.system.core:modal.file_not_found.text',
        defaultMessage:
          'Rannsóknargögnum er eytt af skráasvæði Réttarvörslugáttar eftir að þau hafa verið vistuð í varðveisluskyni í Auði. Ef þau eru ekki vistuð í Auði er þeim eytt eftir að kærufresti lýkur.',
        description:
          'Notaður sem texti fyrir popup glugga sem segir að skjal sé ekki lengur aðgengilegt í RVG þegar reynt er að opna það',
      },
    }),
  },
}
