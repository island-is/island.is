import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-router-dom'

import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useSubmitting } from '@island.is/react-spa/shared'
import { AuthAdminEnvironment } from '@island.is/api/schema'

import { m } from '../../lib/messages'

/**
 * Compares if two form data objects are equal
 */
const isFormDataEqual = (a: FormData, b: FormData): boolean =>
  JSON.stringify([...a.entries()]) === JSON.stringify([...b.entries()])

type FormCardProps<Intent> = {
  /**
   * Form intent, used to determine what form is currently being submitted
   */
  intent?: Intent
  selectedEnvironment?: AuthAdminEnvironment
  availableEnvironments?: AuthAdminEnvironment[]
  title: string
  children: React.ReactNode
}

export const FormCard = <Intent,>({
  title,
  children,
  intent,
  selectedEnvironment,
  availableEnvironments,
}: FormCardProps<Intent>) => {
  const { formatMessage } = useLocale()
  const [allEnvironments, setAllEnvironments] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const originalFormData = useRef<FormData | undefined>()
  const [dirty, setDirty] = useState(false)
  const { isLoading, isSubmitting, formData } = useSubmitting()
  const currentIntent = formData?.get('intent')

  useEffect(() => {
    if (formRef.current) {
      originalFormData.current = new FormData(formRef.current)
    }
  }, [formRef])

  useEffect(() => {
    if (!isSubmitting && intent === currentIntent && dirty) {
      setDirty(false)
    }
  }, [isLoading, isSubmitting, formData, intent, currentIntent, dirty])

  /**
   * Handle form change. Check if form is dirty and set dirty state accordingly
   */
  const onFormChange = () => {
    if (formRef.current) {
      const newFormData = new FormData(formRef.current)

      if (
        originalFormData.current &&
        !isFormDataEqual(newFormData, originalFormData.current)
      ) {
        originalFormData.current = newFormData
        setDirty(true)
      }
    }
  }

  return (
    <Form ref={formRef} method="post" onChange={onFormChange}>
      <Box
        padding={4}
        borderRadius="large"
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        height="full"
        width="full"
        border="standard"
      >
        <Box>
          <Text as="h2" variant="h3">
            {title}
          </Text>
        </Box>
        <Box marginTop={5}>{children}</Box>
        {intent && (
          <Box
            alignItems={['flexStart', 'center']}
            marginTop={5}
            display="flex"
            justifyContent="spaceBetween"
            rowGap={[2, 0]}
            flexDirection={['column', 'row']}
          >
            <Checkbox
              label={formatMessage(m.saveForAllEnvironments)}
              value={allEnvironments.toString()}
              name={`${intent}_saveInAllEnvironments`}
              onChange={() => setAllEnvironments(!allEnvironments)}
            />
            <Button
              type="submit"
              name="intent"
              value={intent as string}
              disabled={!dirty}
              loading={currentIntent === intent && (isLoading || isSubmitting)}
            >
              {formatMessage(m.saveSettings)}
            </Button>
            {/* hidden input to pass the selected environment to the form */}
            {selectedEnvironment && (
              <input
                type="hidden"
                name="environment"
                value={selectedEnvironment}
              />
            )}
            {availableEnvironments
              ?.filter((env) => env !== selectedEnvironment)
              .map((env) => (
                <input
                  key={env}
                  type="hidden"
                  name="syncEnvironments"
                  value={env}
                />
              ))}
          </Box>
        )}
      </Box>
    </Form>
  )
}
