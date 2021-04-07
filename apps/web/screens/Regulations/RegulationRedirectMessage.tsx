import React, { FC } from 'react'
import { Link, Text } from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import { prettyName } from './regulationUtils'

import { RegulationPageTexts, RegulationRedirect } from './mockData'
import { useNamespace } from '@island.is/web/hooks'

export type RegulationRedirectMessageProps = {
  texts: RegulationPageTexts
  regulation: RegulationRedirect
}

export const RegulationRedirectMessage: FC<RegulationRedirectMessageProps> = (
  props,
) => {
  const { regulation, texts } = props
  const n = useNamespace(texts)

  return (
    <RegulationLayout
      name={regulation.name}
      texts={texts}
      main={
        <>
          <Text
            as="h1"
            variant="h3"
            marginTop={[2, 3, 4, 5]}
            marginBottom={[2, 4]}
          >
            {prettyName(regulation.name)} {regulation.title}
          </Text>
          <Text>{n('redirectText')}</Text>
          <Link color="blue400" underline="small" href={regulation.redirectUrl}>
            {regulation.redirectUrl}
          </Link>
        </>
      }
    />
  )
}
