import React, { FC, useState } from 'react'
import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { Form } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

interface ContentCardProps {
  title: string
  onSave?: (saveOnAllEnvironments: boolean) => void
  changed?: boolean
  withForm?: boolean
}
const ContentCard: FC<ContentCardProps> = ({
  children,
  title,
  onSave,
  changed,
  withForm = true,
}) => {
  const { formatMessage } = useLocale()
  const [allEnvironments, setAllEnvironments] = useState<boolean>(false)

  return (
    <Box
      borderRadius="large"
      padding={2}
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      height="full"
      width="full"
      border={'standard'}
    >
      <Box>
        <Text marginTop={2} marginBottom={4} variant="h3">
          {title}
        </Text>
      </Box>
      {withForm ? (
        <Form method="post">
          {children}
          {onSave && (
            <Box
              alignItems="center"
              marginTop="containerGutter"
              display="flex"
              justifyContent="spaceBetween"
            >
              <Checkbox
                label={formatMessage(m.saveForAllEnvironments)}
                value={`${allEnvironments}`}
                disabled={!changed}
                onChange={() => setAllEnvironments(!allEnvironments)}
              />
              <Button
                disabled={!changed}
                type="submit"
                onClick={() => onSave(allEnvironments)}
              >
                {formatMessage(m.saveSettings)}
              </Button>
            </Box>
          )}
        </Form>
      ) : (
        children
      )}
    </Box>
  )
}

export default ContentCard
