import React from 'react'
import { Button, Hidden, Link, Stack, Text } from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import { prettyName } from '@island.is/regulations'
import { RegulationRedirect } from '@island.is/regulations/web'
import { useRegulationLinkResolver } from './regulationUtils'

import { RegulationPageTexts } from './RegulationTexts.types'
import { useNamespace } from '@island.is/web/hooks'
import { useRouter } from 'next/router'

export type RegulationRedirectMessageProps = {
  texts: RegulationPageTexts
  regulation: RegulationRedirect
}

export const RegulationRedirectMessage = (
  props: RegulationRedirectMessageProps,
) => {
  const router = useRouter()
  const { linkResolver } = useRegulationLinkResolver()
  const { regulation, texts } = props
  const txt = useNamespace(texts)

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
          <Text>{txt('redirectText')}</Text>
          <Link color="blue400" underline="small" href={regulation.redirectUrl}>
            {regulation.redirectUrl}
          </Link>
        </>
      }
      sidebar={
        <Stack space={2}>
          <Hidden print={true}>
            <Link href={linkResolver('regulationshome').href}>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
              >
                {txt('goHome')}
              </Button>
            </Link>
          </Hidden>
        </Stack>
      }
    />
  )
}
