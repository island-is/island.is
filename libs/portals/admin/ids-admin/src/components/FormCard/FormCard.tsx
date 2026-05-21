import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Form, useActionData } from 'react-router-dom'

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
import { AuthAdminEnvironmentFailure } from '@island.is/api/schema'

import { m } from '../../lib/messages'
import { DropdownSync } from '../DropdownSync/DropdownSync'
import { useMultiEnvSupport } from '../../hooks/useMultiEnvSupport'
import { useEnvironment } from '../../context/EnvironmentContext'
import { useIntent } from '../../hooks/useIntent'
import { ConditionalWrapper } from '../ConditionalWrapper'
import { accordionWrapper } from './FormCard.css'

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
   *
   * Note: This function should be memoized to prevent unnecessary re-renders.
   */
  customValidation?(currentValue: FormData, originalValue: FormData): boolean
  /**
   * When true, the Save button is disabled regardless of dirty state.
   * Useful when the form has pending input that must be resolved before submission.
   */
  submitDisabled?: boolean
  /**
   * Synchronous gate run on form submission. Return false to block the action;
   * the parent is then responsible for re-submitting (e.g. via useSubmit) once
   * any required confirmation has been resolved.
   */
  onBeforeSubmit?(formData: FormData): boolean
  /**
   * Forwarded to the underlying `<Form onSubmit>`. Runs synchronously before
   * react-router serializes the form, so it pairs with `flushSync` when the
   * caller needs to commit transient UI state into form-visible fields.
   */
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  headerMarginBottom?: 3 | 5
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
  submitDisabled,
  onBeforeSubmit,
  onSubmit,
  headerMarginBottom = 5,
}: FormCardProps<Intent>) => {
  const { formatMessage } = useLocale()
  const [allEnvironmentsCheck, setAllEnvironmentsCheck] = useState(inSync)
  const formRef = useRef<HTMLFormElement | null>(null)
  const prevFormData = useRef<FormData | undefined>()
  const [dirty, setDirty] = useState(false)
  const shouldSupportMultiEnv = useMultiEnvSupport(
    shouldSupportMultiEnvironment,
  )

  const { availableEnvironments, selectedEnvironment } = useEnvironment()
  const { isLoading, isSubmitting, formData } = useSubmitting()
  const { loading } = useIntent(intent)
  const actionData = useActionData() as
    | (RouterActionResponse<
        unknown, // We don't know the type of the data or the error since it can be permission or client.
        unknown,
        Intent
      > & {
        failedEnvironments?: Pick<
          AuthAdminEnvironmentFailure,
          'environment' | 'message'
        >[]
      })
    | undefined

  /**
   * On form change check if form is dirty and set dirty state accordingly.
   * Update original form data if it has changed and use custom validation if provided.
   */
  const onFormChange = () => {
    if (formRef.current) {
      const newFormData = new FormData(formRef.current)
      const newFormDataEntries = [...newFormData.entries()]
      const prevFormDataEntries = [...(prevFormData.current?.entries() ?? [])]

      // If a formData entry is removed or added, then the form is dirty
      if (newFormDataEntries.length !== prevFormDataEntries.length) {
        setDirty(true)
        return
      }

      if (
        prevFormData.current &&
        // If a formData entry value is changed, then the form is dirty
        !isFormDataEqual(newFormData, prevFormData.current)
      ) {
        // If custom validation is provided, use that to determine if form is dirty
        setDirty(
          customValidation
            ? customValidation(newFormData, prevFormData.current)
            : true,
        )
      }
    }
  }

  useEffect(() => {
    if (inSync !== allEnvironmentsCheck) {
      // Update state check if inSync updates
      setAllEnvironmentsCheck(inSync)
    }
  }, [inSync])

  useEffect(() => {
    if (actionData?.intent === intent) {
      if (actionData?.data) {
        if (formRef.current) {
          prevFormData.current = new FormData(formRef.current)
        }

        onFormChange()

        const failedEnvironments = actionData?.failedEnvironments

        if (failedEnvironments && failedEnvironments.length > 0) {
          const envs = failedEnvironments.map((f) => f.environment).join(', ')
          toast.warning(formatMessage(m.partiallySaved, { envs }))
        } else {
          toast.success(formatMessage(m.successfullySaved))
        }
      } else if (actionData?.globalError) {
        toast.error(formatMessage(m.globalErrorMessage))
      }
    }
  }, [actionData, intent])

  // On mount or environment change, reset the baseline form data and dirty state
  useEffect(() => {
    if (formRef.current) {
      prevFormData.current = new FormData(formRef.current)
      setDirty(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEnvironment])

  useEffect(() => {
    // Reset dirty state if form is not submitting, prev and current form data are the same and if form is already dirty
    if (
      !isSubmitting &&
      isLoading &&
      dirty &&
      formRef.current &&
      prevFormData.current &&
      isFormDataEqual(new FormData(formRef.current), prevFormData.current)
    ) {
      setDirty(false)
    }
  }, [isLoading, isSubmitting, formData, intent, dirty])

  useEffect(() => {
    if (customValidation && formRef.current && prevFormData.current && !dirty) {
      setDirty(
        customValidation(new FormData(formRef.current), prevFormData.current),
      )
    }
  }, [formData, customValidation])

  return (
    <Form
      ref={formRef}
      method="post"
      onChange={onFormChange}
      onSubmit={(e) => {
        if (onSubmit) {
          onSubmit(e)
        }
        if (onBeforeSubmit && formRef.current) {
          const submitter = (e.nativeEvent as SubmitEvent).submitter
          const fd = new FormData(formRef.current, submitter)
          if (!onBeforeSubmit(fd)) {
            e.preventDefault()
          }
        }
      }}
    >
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
          rowGap={2}
          flexDirection="column"
          marginBottom={headerMarginBottom}
        >
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
          {description && <Text>{description}</Text>}
        </Box>
        <ConditionalWrapper
          condition={Boolean(accordionLabel)}
          trueWrapper={(cld) => (
            <div className={accordionWrapper}>
              <Box marginTop={3}>
                <AccordionItem label={accordionLabel} id={intent as string}>
                  {cld}
                </AccordionItem>
              </Box>
            </div>
          )}
        >
          <>
            <Box>{children}</Box>
            {intent && (
              <Box
                alignItems={['flexStart', 'center']}
                marginTop={5}
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
                    checked={allEnvironmentsCheck}
                    value="true"
                    disabled={!dirty}
                    name={`${intent}_saveInAllEnvironments`}
                    onChange={() =>
                      setAllEnvironmentsCheck(!allEnvironmentsCheck)
                    }
                  />
                )}
                <Button
                  type="submit"
                  name="intent"
                  value={intent}
                  disabled={!dirty || submitDisabled}
                  loading={loading}
                  dataTestId={`button-save-${title}`}
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
