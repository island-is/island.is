import React from 'react'
import Router from 'next/router'

import {
  Box,
  Button,
  Icon,
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'

import { useTranslations } from '../../i18n'

function NotFound() {
  const {
    t: { notFound: t },
  } = useTranslations()
  if (!t.title) {
    return null
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '8/12', '6/12']}>
          <Box
            marginBottom={8}
            background="blue100"
            borderColor="blue300"
            borderWidth="standard"
            borderStyle="solid"
            borderRadius="standard"
            display="flex"
            alignItems="center"
            padding={3}
          >
            <Box marginRight={2}>
              <Icon type="info" />
            </Box>
            <Box marginRight={2}>
              <Typography variant="p">
                <strong>{t.title}</strong>
              </Typography>
              <Typography variant="p">{t.content}</Typography>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Button variant="text" onClick={() => Router.back()}>
        <Box marginRight={1} alignItems="center" display="flex">
          <Icon type="arrowLeft" width={16} />
        </Box>
        {t.button}
      </Button>
    </GridContainer>
  )
}

export default NotFound
