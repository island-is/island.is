import { Box, Divider } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { prettyName } from '@island.is/regulations'
import React from 'react'
import { editorMsgs } from '../messages'
import { RegDraftForm } from '../state/types'

export type ImpactListProps = {
  impacts: RegDraftForm['impacts']
}

export const ImpactList = (props: ImpactListProps) => {
  const { impacts } = props

  const t = useLocale().formatMessage

  if (impacts.length > 0) {
    return null
  }

  return (
    <>
      <Box marginTop={[2, 2, 6]}>
        <Divider />
        {' '}
      </Box>

      {impacts.map((impact, i) => {
        const { id, name, regTitle, error, type, date } = impact
        return (
          <div key={i}>
            {name === 'self'
              ? t(editorMsgs.impactSelfAffecting)
              : `${prettyName(name)} ${regTitle}`}
          </div>
        )
      })}
    </>
  )
}
