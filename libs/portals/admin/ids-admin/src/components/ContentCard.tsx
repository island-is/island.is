import isEqual from 'lodash/isEqual'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Form, useActionData } from 'react-router-dom'

import {
  Box,
  Button,
  Checkbox,
  Text,
  toast,
  AccordionItem,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import {
  ClientFormTypes,
  EditApplicationResult,
  schema,
} from '../screens/Client/EditClient.action'
import { m } from '../lib/messages'
import { ConditionalWrapper } from './ConditionalWrapper'
import { DropdownSync } from './DropdownSync/DropdownSync'
import { useMultiEnvSupport } from '../hooks/useMultiEnvSupport'
import { useIntent } from '../hooks/useIntent'
import { useEnvironment } from '../context/EnvironmentContext'

interface ContentCardProps {
  title: string
  description?: string | React.ReactNode
  isDirty?:
    | ((currentValue: FormData, originalValue: FormData) => boolean)
    | boolean
  inSync?: boolean
  intent?: ClientFormTypes
  /**
   * The children will be wrapped in an accordion when a label is provided to the component.
   */
  accordionLabel?: string
  shouldSupportMultiEnvironment?: boolean
}

function defaultIsDirty(newFormData: FormData, originalFormData: FormData) {
  let tempChanged = false
  for (const [key, value] of originalFormData.entries()) {
    if (newFormData?.get(key) !== value) {
      tempChanged = true
    }
  }
  return tempChanged
}

const ContentCard: FC<ContentCardProps> = ({
  children,
  title,
  description,
  isDirty = defaultIsDirty,
  intent = ClientFormTypes.none,
  accordionLabel = false,
  shouldSupportMultiEnvironment,
  inSync = false,
}) => {
  const { formatMessage } = useLocale()
  const originalFormData = useRef<FormData>()
  const [dirty, setDirty] = useState(false)
  const ref = useRef<HTMLFormElement>(null)
  const shouldSupportMultiEnv = useMultiEnvSupport(
    shouldSupportMultiEnvironment,
  )
  const { loading } = useIntent(intent)
  const { availableEnvironments, selectedEnvironment } = useEnvironment()
  const actionData = useActionData() as EditApplicationResult<
    typeof schema[typeof intent]
  >

  const actionDataRef = useRef(actionData?.data)

  useEffect(() => {
    if (typeof isDirty !== 'function') {
      setDirty(isDirty)
    }
  }, [isDirty])

  useEffect(() => {
    if (
      actionData?.intent === intent &&
      !isEqual(actionData?.data, actionDataRef?.current)
    ) {
      if (actionData?.data) {
        actionDataRef.current = actionData?.data
        originalFormData.current = new FormData(ref.current as HTMLFormElement)
        onChange()
        toast.success(formatMessage(m.successfullySaved))
      } else if (actionData?.globalError) {
        toast.error(formatMessage(m.globalErrorMessage))
      }
    }
  }, [actionData, intent])

  const [allEnvironments, setAllEnvironments] = useState(inSync)

  // On change, check if the form has changed, use custom validation if provided
  const onChange = () => {
    const newFormData = new FormData(ref.current as HTMLFormElement)

    const newData = [...newFormData.entries()]
    const originalData = [...(originalFormData.current?.entries() ?? [])]

    if (newData.length !== originalData.length) {
      setDirty(true)
      return
    }

    setDirty(
      typeof isDirty === 'function'
        ? isDirty(newFormData, originalFormData.current ?? new FormData())
        : isDirty,
    )
  }

  // On mount, set the original form data
  useEffect(() => {
    originalFormData.current = new FormData(ref.current as HTMLFormElement)
  }, [ref])

  return (
    <Form ref={ref} onChange={onChange} method="post">
      <Box
        borderRadius="large"
        padding={[3, 4]}
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        height="full"
        width="full"
        border="standard"
        position="relative"
      >
        <Box>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            rowGap={2}
            justifyContent="spaceBetween"
            alignItems={['flexStart', 'center']}
            marginBottom={4}
          >
            <Text variant="h3">{title}</Text>
            {shouldSupportMultiEnv && intent !== 'none' && (
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
            {children}
            {intent !== 'none' && (
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
                    id={`${intent}#allEnvironments`}
                    name="allEnvironments"
                    onChange={() => setAllEnvironments(!allEnvironments)}
                  />
                )}
                <Button
                  disabled={!dirty}
                  size="small"
                  type="submit"
                  name="intent"
                  value={intent}
                  loading={loading}
                >
                  {formatMessage(m.saveSettings)}
                </Button>
                {/*hidden input to pass the selected environment to the form*/}
                <input
                  type="hidden"
                  name="environment"
                  value={selectedEnvironment}
                />
                <input
                  type="hidden"
                  name="syncEnvironments"
                  value={`${availableEnvironments
                    ?.filter((env) => env !== selectedEnvironment)
                    .join(',')}`}
                />
              </Box>
            )}
          </>
        </ConditionalWrapper>
      </Box>
    </Form>
  )
}

export default ContentCard
