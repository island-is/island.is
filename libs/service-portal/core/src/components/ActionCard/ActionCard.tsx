import React, { FC } from 'react'
import {
  Box,
  Typography,
  Stack,
  Inline,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import ActionMenu from '../ActionMenu/ActionMenu'
import * as styles from './ActionCard.treat'
import { Link } from 'react-router-dom'

interface Props {
  label: string
  title: string
  text: string
  date: Date
  url?: string
  external?: boolean
  actionMenuRender?: () => JSX.Element
  buttonRender?: () => JSX.Element
}

export const ActionCard: FC<Props> = ({
  label,
  title,
  text,
  date,
  url,
  external,
  actionMenuRender,
  buttonRender,
}) => {
  return (
    <Box
      className={styles.wrapper}
      paddingY={3}
      paddingX={4}
      border="standard"
      borderRadius="large"
    >
      <Stack space={1}>
        <Columns alignY="center" space={3}>
          <Column>
            <Typography variant="eyebrow" color="purple400">
              {label}
            </Typography>
          </Column>
          <Column width="content">
            <Inline space={1} alignY="center">
              <Typography
                variant="pSmall"
                color="dark300"
              >{`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`}</Typography>
              {actionMenuRender && (
                <ActionMenu>{actionMenuRender()}</ActionMenu>
              )}
            </Inline>
          </Column>
        </Columns>
        <Typography variant="h3">
          {url ? (
            external ? (
              <a
                href={url}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </a>
            ) : (
              <Link to={url} className={styles.link}>
                {title}
              </Link>
            )
          ) : (
            title
          )}
        </Typography>
        <Columns alignY="center" collapseBelow="sm" space={3}>
          <Column>
            <Typography variant="p">{text}</Typography>
          </Column>
          {buttonRender && (
            <Column width="content">
              <Box display="flex" justifyContent="flexEnd" flexShrink={0}>
                {buttonRender()}
              </Box>
            </Column>
          )}
        </Columns>
      </Stack>
    </Box>
  )
}

export default ActionCard
