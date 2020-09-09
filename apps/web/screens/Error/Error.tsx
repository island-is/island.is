import React, { ReactNode, Fragment } from 'react'
import { useRouter } from 'next/router'
import { Screen } from '@island.is/web/types'
import { Typography, Box } from '@island.is/island-ui/core'
import useI18n from '@island.is/web/i18n/useI18n'
import * as styles from './Error.treat'

const nlToBr = (text: string): ReactNode =>
  text.split(/\r\n|\r|\n/g).map((s, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {s}
    </Fragment>
  ))

const formatBody = (body: string, path: string): ReactNode =>
  body.split('{PATH}').map((s, i) => (
    <Fragment key={i}>
      {i > 0 && <i>{path}</i>}
      {nlToBr(s)}
    </Fragment>
  ))

type ErrorPageProps = {
  statusCode: number
}

export const ErrorPage: Screen<ErrorPageProps> = ({ statusCode }) => {
  const { asPath } = useRouter()
  const { t } = useI18n()
  const title = statusCode === 404 ? t.error404Title : t.error500Title
  const body = statusCode === 404 ? t.error404Body : t.error500Body

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className={styles.container}
      textAlign="center"
    >
      <Typography
        variant="eyebrow"
        as="div"
        paddingBottom={2}
        color="purple400"
      >
        {statusCode}
      </Typography>
      <Typography variant="h1" as="h1" paddingBottom={3}>
        {title}
      </Typography>
      <Typography variant="intro" as="p">
        {formatBody(body, asPath)}
      </Typography>
    </Box>
  )
}

export default ErrorPage
