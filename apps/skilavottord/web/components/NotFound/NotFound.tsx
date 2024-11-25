import React from 'react'
import Router from 'next/router'
import {
  Box,
  Button,
  Icon,
  Text,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'

export const NotFound = () => {
  const {
    t: { notFound: t },
  } = useI18n()
  if (!t.title) {
    return null
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '8/12', '6/12']}>
          <Box
            marginY={8}
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
              <Icon
                icon="informationCircle"
                type="outline"
                color="blue400"
                size="large"
              />
            </Box>
            <Box marginRight={2}>
              <Text>
                <strong>{t.title}</strong>
              </Text>
              <Text>{t.content}</Text>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Button variant="text" onClick={() => Router.back()}>
        <Box alignItems="center" display="flex">
          <Icon icon="arrowBack" size="medium" />
          <Box margin={1}>{t.button}</Box>
        </Box>
      </Button>
    </GridContainer>
  )
}

export default NotFound
