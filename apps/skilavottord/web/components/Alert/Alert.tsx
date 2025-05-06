import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Stack,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Router from 'next/router'

export enum AlertType {
  ACCESS_DENIED = 0,
  NOT_FOUND = 1,
}

export const Alert = ({ type }: { type: AlertType }) => {
  const {
    t: { alerts: t },
  } = useI18n()

  const message =
    type === AlertType.NOT_FOUND
      ? { title: t.notFound.title, message: t.notFound.message }
      : { title: t.accessDenied.title, message: t.accessDenied.message }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12">
          <Stack space={2}>
            <AlertMessage
              type="info"
              title={message.title}
              message={message.message}
            />
            <Button variant="text" onClick={() => Router.back()}>
              <Box alignItems="center" display="flex">
                <Icon icon="arrowBack" size="medium" />
                <Box margin={1}>{t.notFound.button}</Box>
              </Box>
            </Button>
          </Stack>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Alert
