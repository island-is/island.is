import React from 'react'
import copyToClipboard from 'copy-to-clipboard'
import { useIntl } from 'react-intl'

import { Button, toast } from '@island.is/island-ui/core'
import {
  core,
  errors as errorMessage,
} from '@island.is/judicial-system-web/messages'
import { formatDefenderRoute } from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  caseId: string
  type: CaseType
  disabled: boolean
}

const CopyLinkForDefenderButton: React.FC<Props> = ({
  caseId,
  type,
  disabled,
  children,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Button
      size="small"
      variant="ghost"
      icon="link"
      data-testid="copyLinkToCase"
      disabled={disabled}
      onClick={() => {
        const copied = copyToClipboard(
          `${formatDefenderRoute(window.location.origin, type, caseId)}`,
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
