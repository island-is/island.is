import { useContext } from 'react'

import { AlertMessage } from '@island.is/island-ui/core'
import {
  FormContext,
  MarkdownWrapper,
} from '@island.is/judicial-system-web/src/components'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

const modifiedTitle = 'Úrskurður Landsréttar leiðréttur'

const AppealRulingModifiedAlert = () => {
  const { workingCase } = useContext(FormContext)

  const caseLevelHistory = workingCase.appealCase?.appealRulingModifiedHistory

  const rulingOrderCorrections = (
    workingCase.rulingOrderAppealCases ?? []
  ).filter((appealCase) => Boolean(appealCase.appealRulingModifiedHistory))

  if (!caseLevelHistory && rulingOrderCorrections.length === 0) {
    return null
  }

  const rulingOrderTitle = (rulingFileId?: string | null) => {
    const fileName = workingCase.caseFiles?.find(
      (file) => file.id === rulingFileId,
    )?.userGeneratedFilename

    return fileName ? `${modifiedTitle} — ${fileName}` : modifiedTitle
  }

  return (
    <div className={grid({ gap: 2 })}>
      {caseLevelHistory && (
        <AlertMessage
          type="info"
          title={modifiedTitle}
          message={
            <MarkdownWrapper
              markdown={caseLevelHistory}
              textProps={{ variant: 'small' }}
            />
          }
        />
      )}
      {rulingOrderCorrections.map((appealCase) => (
        <AlertMessage
          key={appealCase.id}
          type="info"
          title={rulingOrderTitle(appealCase.rulingFileId)}
          message={
            <MarkdownWrapper
              markdown={appealCase.appealRulingModifiedHistory ?? ''}
              textProps={{ variant: 'small' }}
            />
          }
        />
      ))}
    </div>
  )
}

export default AppealRulingModifiedAlert
