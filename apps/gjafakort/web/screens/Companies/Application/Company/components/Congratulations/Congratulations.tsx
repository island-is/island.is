import React from 'react'

import { Box, Typography, Stack, Button, Icon } from '@island.is/island-ui/core'

import packageSvg from '@island.is/gjafakort-web/assets/ferdagjof-pakki.svg'
import Layout from '@island.is/gjafakort-web/components/Layout/Layout'
import { useI18n } from '@island.is/gjafakort-web/i18n'

function Congratulations() {
  const {
    t: {
      company: { congratulations: t },
    },
  } = useI18n()

  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={6}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                {t.title}
              </Typography>
              <Typography variant="intro">{t.intro}</Typography>
              <Typography variant="p">{t.description}</Typography>
              <Button
                variant="text"
                size="large"
                href="https://manager.yay.is/Account/Login?ReturnUrl=%2F"
              >
                {t.button}{' '}
                <Box marginLeft={1} alignItems="center" display="flex">
                  <Icon type="arrowRight" width={16} />
                </Box>
              </Button>
              {t.contents.map((content, index) => (
                <Typography variant="p" key={index}>
                  {content}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Box>
      }
      right={
        <Box textAlign="center" padding={3}>
          <img src={packageSvg} alt="" />
        </Box>
      }
    />
  )
}

export default Congratulations
