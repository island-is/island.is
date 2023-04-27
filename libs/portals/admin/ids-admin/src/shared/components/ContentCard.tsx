import React, { FC, useContext, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  DropdownMenu,
  Icon,
  LoadingDots,
  Text,
  toast,
  AccordionItem,
} from '@island.is/island-ui/core'
import { Form, useActionData } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  ClientFormTypes,
  EditApplicationResult,
  getIntentWithSyncCheck,
  schema,
} from '../../components/forms/EditApplication/EditApplication.action'
import * as styles from './ContentCard.css'
import { ClientContext } from '../context/ClientContext'
import { useSubmitting } from '@island.is/react-spa/shared'
import isEqual from 'lodash/isEqual'
import { ConditionalWrapper } from './ConditionalWrapper'

interface ContentCardProps {
  title: string
  description?: string
  isDirty?: (currentValue: FormData, originalValue: FormData) => boolean
  inSync?: boolean
  intent?: ClientFormTypes
  /**
   * The children will be wrapped in an accordion when a label is provided to the component.
   */
  accordionLabel?: string
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
}) => {
  const { formatMessage } = useLocale()
  const [allEnvironments, setAllEnvironments] = useState<boolean>(false)
  const originalFormData = useRef<FormData>()
  const [dirty, setDirty] = useState<boolean>(false)
  const ref = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { isLoading, isSubmitting, formData } = useSubmitting()

  const actionData = useActionData() as EditApplicationResult<
    typeof schema[typeof intent]
  >

  const actionDataRef = useRef(actionData?.data)

  useEffect(() => {
    if (actionData?.intent === intent) {
      if (!isEqual(actionData?.data, actionDataRef?.current)) {
        if (actionData?.data) {
          actionDataRef.current = actionData?.data
          originalFormData.current = new FormData(
            ref.current as HTMLFormElement,
          )
          toast.success(formatMessage(m.successfullySaved))
        }
        if (actionData?.globalError) {
          toast.error(formatMessage(m.globalErrorMessage))
        }
      }
    }
  }, [actionData, intent, formatMessage])

  const {
    checkIfInSync,
    variablesToCheckSync,
    selectedEnvironment,
    availableEnvironments,
  } = useContext(ClientContext)

  const checkIfLoadingForIntent = () => {
    if (intent === ClientFormTypes.none) {
      return false
    }

    if (formData === undefined) {
      return false
    }

    const intentToCheck = getIntentWithSyncCheck(formData)
    return (isSubmitting || isLoading) && intentToCheck.name === intent
  }
  const isLoadingForIntent = checkIfLoadingForIntent()

  const inSync = checkIfInSync(
    variablesToCheckSync?.[intent as keyof typeof ClientFormTypes] ?? [],
  )

  // On change, check if the form has changed, use custom validation if provided
  const onChange = () => {
    const newFormData = new FormData(ref.current as HTMLFormElement)

    const newData = [...newFormData.entries()]
    const originalData = [...(originalFormData.current?.entries() ?? [])]

    if (newData.length !== originalData.length) {
      setDirty(true)
      return
    }

    setDirty(isDirty(newFormData, originalFormData.current ?? new FormData()))
  }

  // On mount, set the original form data
  useEffect(() => {
    originalFormData.current = new FormData(ref.current as HTMLFormElement)
  }, [ref])

  return (
    <Form ref={ref} onChange={onChange} method="post">
      <Box
        borderRadius="large"
        paddingY={2}
        paddingX={4}
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
            marginTop={2}
            marginBottom={4}
          >
            <Text ref={titleRef} variant="h3">
              {title}
            </Text>
            {intent !== 'none' && (
              <Box>
                <DropdownMenu
                  title={
                    inSync
                      ? formatMessage(m.inSync)
                      : formatMessage(m.outOfSync)
                  }
                  icon="chevronDown"
                  menuClassName={styles.menu}
                  items={[
                    {
                      title: '',
                      render: () => (
                        <div key={`${intent}-syncText`}>
                          <Box
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                            columnGap={1}
                            className={styles.menuItem}
                          >
                            <Icon
                              icon={inSync ? 'checkmark' : 'warning'}
                              color={inSync ? 'blue400' : 'red400'}
                              size="small"
                              type="outline"
                            />
                            <Text variant="small" color="blue400">
                              {inSync
                                ? formatMessage(m.inSyncAcrossAllEnvironments)
                                : formatMessage(
                                    m.notInSyncAcrossAllEnvironments,
                                  )}
                            </Text>
                          </Box>
                          <Divider />
                        </div>
                      ),
                    },
                    ...(inSync || dirty
                      ? []
                      : [
                          {
                            title: '',
                            render: () => (
                              <Box
                                key={`${intent}-syncButton`}
                                display="flex"
                                justifyContent="center"
                                padding={2}
                              >
                                {isLoadingForIntent ? (
                                  <LoadingDots large />
                                ) : (
                                  <button
                                    className={styles.syncButton}
                                    type="submit"
                                    value={`${intent}-sync`}
                                    name="intent"
                                  >
                                    <Text
                                      variant="small"
                                      fontWeight="semiBold"
                                      color={'blue400'}
                                    >
                                      {formatMessage(m.syncSettings)}
                                    </Text>
                                  </button>
                                )}
                              </Box>
                            ),
                          },
                        ]),
                  ]}
                />
              </Box>
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
                justifyContent="spaceBetween"
                rowGap={[2, 0]}
                flexDirection={['column', 'row']}
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
                  name="intent"
                  value={intent}
                  loading={isLoadingForIntent}
                >
                  {formatMessage(m.saveSettings)}
                </Button>
                {/*hidden input to pass the selected environment to the form*/}
                <input
                  type="hidden"
                  name="environment"
                  value={selectedEnvironment.environment}
                />
                <input
                  type="hidden"
                  name="syncEnvironments"
                  value={`${availableEnvironments
                    ?.filter((env) => env !== selectedEnvironment.environment)
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
