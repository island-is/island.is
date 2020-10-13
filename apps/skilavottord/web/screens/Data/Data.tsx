import React, { useEffect, useState } from 'react'
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

const nationalId = '2222222222'

const Data = () => {
  const [checkbox, setCheckbox] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()

  // const { data, loading, error } = useQuery(GET_GDPR_INFO, {
  //   variables: { nationalId },
  // })

  const {
    t: { data: t, routes },
  } = useI18n()
  const router = useRouter()

  // const [
  //   setGDPRInfo,
  //   { loading: mutationLoading, error: mutationError },
  // ] = useMutation(SET_GDPR_INFO)

  // useEffect(() => {
  //   if (data) {
  //     router.replace(routes.myCars)
  //   }
  // }, [data])

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const handleContinue = () => {
    // setGDPRInfo({ variables: { nationalId } })
    router.replace(routes.myCars)
  }

  return (
    <PageLayout>
      <Stack space={[3, 3, 3, 4]}>
        <Text variant="h1">{t.title}</Text>
        <Stack space={3}>
          <Box display="flex" alignItems="center">
            <Icon
              icon="documents"
              type="outline"
              color="blue400"
              size="large"
            />
            <Box marginLeft={1}>
              <Text variant="h3">{t.subTitles.info}</Text>
            </Box>
          </Box>
          <Text>{t.info}</Text>
        </Stack>
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
      </Stack>
      <Box paddingY={6}>
        <Button onClick={handleContinue} disabled={!checkbox} fluid={isMobile}>
          {t.buttons.continue}
        </Button>
      </Box>
    </PageLayout>
  )
}

export default Data
