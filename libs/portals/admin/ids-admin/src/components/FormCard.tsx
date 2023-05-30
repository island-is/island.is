import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-router-dom'

import { Box, Button, Checkbox, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useSubmitting } from '@island.is/react-spa/shared'

import { m } from '../lib/messages'
import { DropdownSync } from './DropdownSync/DropdownSync'
import { useMultiEnvSupport } from '../hooks/useMultiEnvSupport'
import { useEnvironment } from '../context/EnvironmentContext'
import { useIntent } from '../hooks/useIntent'

/**
 * Compares if two form data objects are equal
 */
const isFormDataEqual = (a: FormData, b: FormData): boolean =>
  JSON.stringify([...a.entries()]) === JSON.stringify([...b.entries()])

type FormCardProps<Intent> = {
  title: string
  /**
   * Form intent, used to determine what form is currently being submitted
   */
  intent?: Intent
  /**
   * If false the card will not render the sync dropdown
   */
  shouldSupportMultiEnvironment?: boolean
  /**
   * Determines if environment section contents is in sync with other environments
   */
  inSync?: boolean
  children: React.ReactNode
}

export const FormCard = <Intent extends string>({
  title,
  children,
  intent,
  inSync = false,
  shouldSupportMultiEnvironment,
}: FormCardProps<Intent>) => {
  const { formatMessage } = useLocale()
  const [allEnvironments, setAllEnvironments] = useState(inSync)
  const formRef = useRef<HTMLFormElement | null>(null)
  const originalFormData = useRef<FormData | undefined>()
  const [dirty, setDirty] = useState(false)
  const shouldSupportMultiEnv = useMultiEnvSupport(
    shouldSupportMultiEnvironment,
  )
  const { availableEnvironments, selectedEnvironment } = useEnvironment()
  const { isLoading, isSubmitting, formData } = useSubmitting()
  const { loading, currentIntent } = useIntent(intent)

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
        <Box
          display="flex"
          flexDirection={['column', 'row']}
          rowGap={2}
          justifyContent="spaceBetween"
          alignItems={['flexStart', 'center']}
          marginBottom={4}
        >
          <Text as="h2" variant="h3">
            {title}
          </Text>
          {shouldSupportMultiEnv && intent && (
            <DropdownSync
              intent={intent}
              inSync={inSync}
              isDirty={dirty}
              isLoading={loading}
            />
          )}
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
              checked={allEnvironments}
              value={allEnvironments.toString()}
              name={`${intent}_saveInAllEnvironments`}
              onChange={() => setAllEnvironments(!allEnvironments)}
            />
            <Button
              type="submit"
              name="intent"
              value={intent as string}
              disabled={!dirty}
              loading={loading}
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
