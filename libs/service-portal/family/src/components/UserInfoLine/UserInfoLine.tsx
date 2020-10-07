import React, { FC } from 'react'
import {
  Box,
  Columns,
  Column,
  Typography,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'

interface Props {
  label: MessageDescriptor | string
  content?: string
  onEdit?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  editExternalLink?: string
}

const UserInfoLine: FC<Props> = ({
  label,
  content,
  onEdit,
  editExternalLink,
}) => {
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
        {onEdit || editExternalLink ? (
          <Column width="3/12">
            <Box overflow="hidden" textAlign="right">
              {onEdit ? (
                <Button
                  variant="text"
                  size="small"
                  icon="external"
                  onClick={onEdit}
                >
                  {formatMessage({
                    id: 'global:edit',
                    defaultMessage: 'Breyta',
                  })}
                </Button>
              ) : (
                <a href={editExternalLink} target="_blank">
                  <Button
                    variant="text"
                    size="small"
                    icon="external"
                    onClick={onEdit}
                  >
                    {formatMessage({
                      id: 'global:edit',
                      defaultMessage: 'Breyta',
                    })}
                  </Button>
                </a>
              )}
            </Box>
          </Column>
        ) : null}
      </Columns>
    </Box>
  )
}

export default UserInfoLine
