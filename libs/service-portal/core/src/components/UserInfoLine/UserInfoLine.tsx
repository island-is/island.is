import React, { FC } from 'react'
import {
  Box,
  Typography,
  Button,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Link } from 'react-router-dom'
import * as styles from './UserInfoLine.treat'

interface Props {
  label: MessageDescriptor | string
  content?: string | JSX.Element
  tag?: string | JSX.Element
  editLink?: {
    external?: boolean
    url: string
    title?: MessageDescriptor
  }
}

export const UserInfoLine: FC<Props> = ({ label, content, tag, editLink }) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      paddingY={[2, 3]}
      paddingX={[2, 4]}
      border="standard"
      borderRadius="large"
    >
      <GridRow>
        <GridColumn order={1} span={['8/12', '4/12']}>
          <Box overflow="hidden">
            <Typography variant="h5">{formatMessage(label)}</Typography>
          </Box>
        </GridColumn>
        <GridColumn order={[3, 2]} span={['1/1', tag ? '3/12' : '5/12']}>
          <Box className={styles.content} marginY={[1, 0]} overflow="hidden">
            {content}
          </Box>
        </GridColumn>
        {tag && (
          <GridColumn order={[2, 3]} span={['4/12', '2/12']}>
            <Box display="flex" justifyContent={['flexEnd', 'flexStart']}>
              {tag}
            </Box>
          </GridColumn>
        )}
        {editLink ? (
          <GridColumn order={4} span={['1/1', '3/12']}>
            <Box
              display="flex"
              justifyContent={['flexStart', 'flexEnd']}
              overflow="hidden"
              className={styles.buttonWrapper}
            >
              {editLink.external ? (
                <a
                  href={editLink.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    variant="text"
                    size="small"
                    icon="open"
                    iconType="outline"
                  >
                    {editLink.title
                      ? formatMessage(editLink.title)
                      : formatMessage({
                          id: 'global:edit',
                          defaultMessage: 'Breyta',
                        })}
                  </Button>
                </a>
              ) : (
                <Link to={editLink.url}>
                  <Button variant="text" size="small">
                    {editLink.title
                      ? formatMessage(editLink.title)
                      : formatMessage({
                          id: 'global:edit',
                          defaultMessage: 'Breyta',
                        })}
                  </Button>
                </Link>
              )}
            </Box>
          </GridColumn>
        ) : null}
      </GridRow>
    </Box>
  )
}
