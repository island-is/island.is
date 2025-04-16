import {
  AlertMessage,
  Box,
  Button,
  Icon,
  Stack,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import Router from 'next/router'

export enum AlertType {
  ACCEES_DENIED = 0,
  NOT_FOUND = 1,
}

export const Alert = ({ type }: { type: AlertType }) => {
  const {
    t: { alerts: t },
  } = useI18n()
  if (!t.notFound.title) {
    return null
  }

  const message =
    type === AlertType.NOT_FOUND
      ? { title: t.notFound.title, message: t.notFound.message }
      : { title: t.accessDenied.title, message: t.accessDenied.message }

  return (
    <Box padding={10}>
      <Stack space={2}>
        <AlertMessage
          type="info"
          title={message.title}
          message={message.message}
        ></AlertMessage>
        <Button variant="text" onClick={() => Router.back()}>
          <Box alignItems="center" display="flex">
            <Icon icon="arrowBack" size="medium" />
            <Box margin={1}>{t.notFound.button}</Box>
          </Box>
        </Button>
      </Stack>
    </Box>
  )
}

export default Alert
