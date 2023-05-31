import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Form, useActionData } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

import {
  AccordionItem,
  Box,
  Button,
  Checkbox,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useSubmitting } from '@island.is/react-spa/shared'
import { RouterActionResponse } from '@island.is/portals/core'

import { m } from '../lib/messages'
import { DropdownSync } from './DropdownSync/DropdownSync'
import { useMultiEnvSupport } from '../hooks/useMultiEnvSupport'
import { useEnvironment } from '../context/EnvironmentContext'
import { useIntent } from '../hooks/useIntent'
import { ConditionalWrapper } from './ConditionalWrapper'

/**
 * Compares if two form data objects are equal
 */
const isFormDataEqual = (a: FormData, b: FormData) =>
  JSON.stringify([...a.entries()]) === JSON.stringify([...b.entries()])

type FormCardProps<Intent> = {
  children: ReactNode
  title: string
  description?: string | ReactNode
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
  /**
   * The children will be wrapped in an accordion when a label is provided to the component.
   */
  accordionLabel?: string
  /**
   * Custom validation function that will be called on form change to determine if form is dirty
   * and when data arrives from mutation.
   * If true is returned then the form is considered dirty.
   */
  customValidation?(currentValue: FormData, originalValue: FormData): boolean
}

export const FormCard = <Intent extends string>({
  title,
  children,
  intent,
  inSync = false,
  shouldSupportMultiEnvironment,
  accordionLabel,
  description,
  customValidation,
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
  const actionData = useActionData() as RouterActionResponse<
    unknown, // We don't know the type of the data or the error since it can be permission or client.
    unknown,
    Intent
  >
  const actionDataRef = useRef(actionData?.data)

  /**
   * On form change check if form is dirty and set dirty state accordingly.
   * Update original form data if it has changed and use custom validation if provided.
   */
  const onFormChange = () => {
    if (formRef.current) {
      const newFormData = new FormData(formRef.current)

      if (
        originalFormData.current &&
        !isFormDataEqual(newFormData, originalFormData.current)
      ) {
        // If custom validation is provided, use that to determine if form is dirty
        setDirty(
          customValidation
            ? customValidation(newFormData, originalFormData.current)
            : true,
        )

        originalFormData.current = newFormData
      }
    }
  }

  useEffect(() => {
    if (
      actionData?.intent === intent &&
      !isEqual(actionData?.data, actionDataRef?.current)
    ) {
      if (actionData?.data) {
        actionDataRef.current = actionData?.data

        onFormChange()
        toast.success(formatMessage(m.successfullySaved))
      } else if (actionData?.globalError) {
        toast.error(formatMessage(m.globalErrorMessage))
      }
    }
  }, [actionData, intent])

  useEffect(() => {
    if (formRef.current) {
      originalFormData.current = new FormData(formRef.current)
    }
  }, [formRef])

  useEffect(() => {
    // Reset dirty state if form is not submitting, intent is the same as current intent and form is already dirty
    if (!isSubmitting && intent === currentIntent && dirty) {
      setDirty(false)
    }
  }, [isLoading, isSubmitting, formData, intent, currentIntent, dirty])

  useEffect(() => {
    if (
      customValidation &&
      formRef.current &&
      originalFormData.current &&
      !dirty
    ) {
      setDirty(
        customValidation(
          new FormData(formRef.current),
          originalFormData.current,
        ),
      )
    }
  }, [formData, customValidation])

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
        <Box display="flex" rowGap={2} flexDirection="column">
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            rowGap={2}
            justifyContent="spaceBetween"
            alignItems={['flexStart', 'center']}
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
          {description && <Text marginBottom={4}>{description}</Text>}
        </Box>
        <ConditionalWrapper
          condition={Boolean(accordionLabel)}
          trueWrapper={(cld) => (
            <AccordionItem label={accordionLabel} id={title}>
              {cld}
            </AccordionItem>
          )}
        >
          <>
            <Box marginTop={5}>{children}</Box>
            {intent && (
              <Box
                alignItems={['flexStart', 'center']}
                marginTop="containerGutter"
                display="flex"
                justifyContent={
                  shouldSupportMultiEnv ? 'spaceBetween' : 'flexEnd'
                }
                rowGap={[2, 0]}
                flexDirection={['column', 'row']}
              >
                {shouldSupportMultiEnv && (
                  <Checkbox
                    label={formatMessage(m.saveForAllEnvironments)}
                    checked={allEnvironments}
                    value="true"
                    disabled={!dirty}
                    name={`${intent}_saveInAllEnvironments`}
                    onChange={() => setAllEnvironments(!allEnvironments)}
                  />
                )}
                <Button
                  type="submit"
                  name="intent"
                  value={intent}
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
          </>
        </ConditionalWrapper>
      </Box>
    </Form>
  )
}
