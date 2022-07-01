import React from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { useIntl } from 'react-intl'

import { Button, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  core,
  errors as errorMessage,
} from '@island.is/judicial-system-web/messages'

interface Props {
  caseId: string
}

const CopyLinkForDefenderButton: React.FC<Props> = ({ caseId, children }) => {
  const { formatMessage } = useIntl()

  return (
    <Button
      size="small"
      variant="ghost"
      icon="link"
      data-testid="copyLinkToCase"
      onClick={() => {
        const copied = copyToClipboard(
          `${window.location.origin}${constants.DEFENDER_ROUTE}/${caseId}`,
        )
        if (!copied) {
          return toast.error(formatMessage(errorMessage.copyLink))
        }
        toast.success(formatMessage(core.linkCopied))
      }}
    >
      {children}
    </Button>
  )
}

export default CopyLinkForDefenderButton
