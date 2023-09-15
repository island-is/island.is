import { defineMessage } from 'react-intl'

export const caseFiles = {
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
