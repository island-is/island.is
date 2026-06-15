import { AlertMessage } from '@island.is/island-ui/core'
import { MarkdownWrapper } from '@island.is/judicial-system-web/src/components'
import { useTargetAppealCaseByAppealCaseId } from '@island.is/judicial-system-web/src/utils/hooks'

const AppealRulingModifiedAlert = () => {
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()

  return targetAppealCase?.appealRulingModifiedHistory ? (
    <AlertMessage
      type="info"
      title="Úrskurður Landsréttar leiðréttur"
      message={
        <MarkdownWrapper
          markdown={targetAppealCase.appealRulingModifiedHistory}
          textProps={{ variant: 'small' }}
        />
      }
    />
  ) : null
}

export default AppealRulingModifiedAlert
