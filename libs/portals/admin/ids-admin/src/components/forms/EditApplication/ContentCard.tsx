import React, { FC, useEffect, useRef, useState } from 'react'
import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { Form } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { ClientFormTypes } from './EditApplication.action'

interface ContentCardProps {
  title: string
  onSave?: (saveOnAllEnvironments: boolean) => void
  isDirty?: (currentValue: FormData, originalValue: FormData) => boolean
  intent?: ClientFormTypes | 'none'
}

function defaultIsDirty(newFormData: FormData, originalFormData: FormData) {
  let tempChanged = false
  for (const [key, value] of newFormData.entries()) {
    if (originalFormData?.get(key) !== value) {
      tempChanged = true
    }
  }
  return tempChanged
}

const ContentCard: FC<ContentCardProps> = ({
  children,
  title,
  onSave,
  isDirty = defaultIsDirty,
  intent = 'none',
}) => {
  const { formatMessage } = useLocale()
  const [allEnvironments, setAllEnvironments] = useState<boolean>(false)
  const originalFormData = useRef<FormData>()
  const [dirty, setDirty] = useState<boolean>(false)
  const ref = useRef<HTMLFormElement>(null)

  // On change, check if the form has changed, use custom validation if provided
  const onChange = () => {
    const newFormData = new FormData(ref.current as HTMLFormElement)

    setDirty(isDirty(newFormData, originalFormData.current ?? new FormData()))
  }

  // On mount, set the original form data
  useEffect(() => {
    originalFormData.current = new FormData(ref.current as HTMLFormElement)
  }, [ref])

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
      <Form ref={ref} onChange={onChange} method="post">
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
              disabled={!dirty}
              name="allEnvironments"
              onChange={() => setAllEnvironments(!allEnvironments)}
            />
            <Button
              disabled={!dirty}
              type="submit"
              onClick={() => onSave(allEnvironments)}
              name="intent"
              value={intent}
            >
              {formatMessage(m.saveSettings)}
            </Button>
          </Box>
        )}
      </Form>
    </Box>
  )
}

export default ContentCard
