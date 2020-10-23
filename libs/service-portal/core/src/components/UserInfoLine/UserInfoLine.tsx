import React, { FC } from 'react'
import {
  Box,
  Columns,
  Column,
  Typography,
  ButtonDeprecated as Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Link } from 'react-router-dom'

interface Props {
  label: MessageDescriptor | string
  content?: string
  editLink?: {
    external?: boolean
    url: string
    title?: MessageDescriptor
  }
}

export const UserInfoLine: FC<Props> = ({ label, content, editLink }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={3} paddingX={4} border="standard" borderRadius="large">
      <Columns space={1} collapseBelow="sm" alignY="center">
        <Column width="5/12">
          <Box overflow="hidden">
            <Typography variant="h5">{formatMessage(label)}</Typography>
          </Box>
        </Column>
        <Column width="4/12">
          <Box overflow="hidden">{content}</Box>
        </Column>
        {editLink ? (
          <Column width="3/12">
            <Box overflow="hidden" textAlign="right">
              {editLink.external ? (
                <a
                  href={editLink.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button variant="text" size="small" icon="external">
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
          </Column>
        ) : null}
      </Columns>
    </Box>
  )
}
