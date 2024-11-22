import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'

import {
  Box,
  Text,
  Icon,
  Checkbox,
  Stack,
  Button,
  Inline,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { PageLayout, InlineError } from '@island.is/skilavottord-web/components'
import { Mutation } from '@island.is/skilavottord-web/graphql/schema'

const SkilavottordGdprMutation = gql`
  mutation skilavottordGdprMutation($gdprStatus: String!) {
    createSkilavottordGdpr(gdprStatus: $gdprStatus)
  }
`

export interface GdprMutation {
  gdprStatus: string
}

export const GDPR = () => {
  const [checkbox, setCheckbox] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  const {
    t: { gdpr: t },
  } = useI18n()
  const router = useRouter()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const [setGDPRInfo, { error: mutationError }] = useMutation<Mutation>(
    SkilavottordGdprMutation,
    {
      onCompleted() {
        router.reload()
      },
      onError() {
        return mutationError
      },
    },
  )

  const handleContinue = () => {
    setGDPRInfo({
      variables: {
        gdprStatus: 'true',
      },
    })
  }

  if (mutationError) {
    return (
      <PageLayout>
        <Stack space={[3, 3, 3, 4]}>
          <Text variant="h1">{t.title}</Text>
          <InlineError
            title={t.subTitles.info}
            message={t.error.message}
            primaryButton={{
              text: t.error.primaryButton,
              action: () => router.reload(),
            }}
          />
        </Stack>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Stack space={[3, 3, 3, 4]}>
        <Text variant="h1">{t.title}</Text>
        <Stack space={[3, 3, 3, 3]}>
          <Inline space={1}>
            <Icon
              icon="documents"
              color="blue400"
              type="outline"
              size={isMobile ? 'medium' : 'large'}
            />
            <Text variant="h3">{t.subTitles.info}</Text>
          </Inline>
          <Text>{t.info}</Text>
          <Box
            paddingY={[3, 3, 3, 4]}
            paddingLeft={[3, 3, 3, 4]}
            paddingRight={[3, 3, 4, 20]}
            background="blue100"
            borderRadius="default"
          >
            <Checkbox
              label={t.checkbox}
              checked={checkbox}
              onChange={({ target }) => {
                setCheckbox(target.checked)
              }}
            />
          </Box>
          <Box paddingY={3}>
            <Button
              onClick={handleContinue}
              disabled={!checkbox}
              fluid={isMobile}
            >
              {t.buttons.continue}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </PageLayout>
  )
}

export default GDPR
