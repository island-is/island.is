import React from 'react'

import { Button, Hidden, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { prettyName, RegulationRedirect } from '@island.is/regulations'
import { useNamespace } from '@island.is/web/hooks'

import { RegulationLayout } from './RegulationLayout'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useRegulationLinkResolver } from './regulationUtils'

export type RegulationRedirectMessageProps = {
  texts: RegulationPageTexts
  regulation: RegulationRedirect
}

export const RegulationRedirectMessage = (
  props: RegulationRedirectMessageProps,
) => {
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
          <LinkV2
            color="blue400"
            underline="small"
            href={regulation.redirectUrl}
          >
            {regulation.redirectUrl}
          </LinkV2>
        </>
      }
      sidebar={
        <Stack space={2}>
          <Hidden print={true}>
            <LinkV2 href={linkResolver('regulationshome').href}>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                as="span"
              >
                {txt('goHome')}
              </Button>
            </LinkV2>
          </Hidden>
        </Stack>
      }
    />
  )
}
