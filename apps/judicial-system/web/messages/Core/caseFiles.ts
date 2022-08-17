import { defineMessages, defineMessage } from 'react-intl'

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
  noFilesFound: defineMessage({
    id: 'judicial.system.core:case_files.no_files_found',
    defaultMessage: 'Engin rannsóknargögn fylgja kröfunni í Réttarvörslugátt.',
    description:
      'Notaður sem texti þegar engar skrár finnast á máli í Réttarvörslugátt',
  }),
  fileUnsupportedInCourt: defineMessage({
    id: 'judicial.system.core:case_files.file_unsupported_in_court',
    defaultMessage: 'Skráartegund ekki studd í Auði',
    description:
      'Notaður sem texti þegar tekst ekki að flytja gögn í Auði þegar skrá er ekki studd',
  }),
  caseNotFoundInCourt: defineMessage({
    id: 'judicial.system.core:case_files.case_not_found_in_court',
    defaultMessage: 'Málsnúmer fannst ekki í Auði',
    description:
      'Notaður sem texti þegar tekst ekki að flytja gögn í Auði vegna þess að málsnúmerið er ekki til í Auði',
  }),
}
