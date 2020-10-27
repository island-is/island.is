import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Text,
  Icon,
  Checkbox,
  Stack,
  Button,
} from '@island.is/island-ui/core'
import { PageLayout } from '@island.is/skilavottord-web/components/Layouts'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { GET_GDPR_INFO } from '@island.is/skilavottord-web/graphql/queries'
import { SET_GDPR_INFO } from '@island.is/skilavottord-web/graphql/mutations'
import { UserContext } from '@island.is/skilavottord-web/context'
import { InlineError } from '@island.is/skilavottord-web/components'

const Data = () => {
  const { user } = useContext(UserContext)
  const [checkbox, setCheckbox] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  const {
    t: { data: t, routes },
  } = useI18n()
  const router = useRouter()

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const { data, loading } = useQuery(GET_GDPR_INFO, {
    variables: { nationalId: user?.nationalId },
  })

  const [setGDPRInfo, { error: mutationError }] = useMutation(SET_GDPR_INFO, {
    onCompleted() {
      router.replace(routes.myCars)
    },
    onError() {
      console.log(mutationError)
    },
  })

  const handleContinue = () => {
    setGDPRInfo({
      variables: {
        gdprStatus: 'true',
        nationalId: user.nationalId,
      },
    })
  }

  if (loading && !data) {
    return null
  } else if (data && data.getGDPRInfo.gdprStatus) {
    router.push(routes.myCars)
    return null
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
          <Text variant="h3">{t.subTitles.info}</Text>
          <Text>{t.info}</Text>
          <Box
            paddingY={[3, 3, 3, 4]}
            paddingLeft={[3, 3, 3, 4]}
            paddingRight={[3, 3, 4, 20]}
            background="blue100"
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

export default Data
