import { useContext } from 'react'

import { AlertMessage } from '@island.is/island-ui/core'
import { isRequestCase } from '@island.is/judicial-system/types'
import {
  FormContext,
  MarkdownWrapper,
} from '@island.is/judicial-system-web/src/components'

const RulingModifiedAlert = () => {
  const { workingCase } = useContext(FormContext)

  return workingCase.rulingModifiedHistory ? (
    <AlertMessage
      type="info"
      title={
        isRequestCase(workingCase.type)
          ? 'Úrskurður leiðréttur'
          : 'Mál leiðrétt'
      }
      message={
        <MarkdownWrapper
          markdown={workingCase.rulingModifiedHistory}
          textProps={{ variant: 'small' }}
        />
      }
    />
  ) : null
}

export default RulingModifiedAlert
