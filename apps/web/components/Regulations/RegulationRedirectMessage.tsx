import React from 'react'
import { Button, Link, Stack, Text } from '@island.is/island-ui/core'
import { RegulationLayout } from './RegulationLayout'
import { prettyName } from './regulationUtils'

import { RegulationRedirect } from './Regulations.types'
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
      sidebar={
        <Stack space={2}>
          {
            <Button
              preTextIcon="arrowBack"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="text"
              onClick={() => {
                window.history.length > 2
                  ? router.back()
                  : router.push('/reglugerdir')
              }}
            >
              Til baka
            </Button>
          }
        </Stack>
      }
    />
  )
}
