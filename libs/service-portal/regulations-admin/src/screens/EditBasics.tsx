import { Input } from '@island.is/island-ui/core'
import React from 'react'
import { useIntl } from 'react-intl'
import { editorMsgs } from '../messages'
import { RegulationDraft } from '../types-api'

export type EditBasicsProps = {
  draft: RegulationDraft
}

export const EditBasics = (props: EditBasicsProps) => {
  const { formatMessage } = useIntl()
  const { draft } = props
  return (
    <>
      <Input
        label={formatMessage(editorMsgs.title)}
        name="title"
        value={draft.title}
      />
    </>
  )
}
