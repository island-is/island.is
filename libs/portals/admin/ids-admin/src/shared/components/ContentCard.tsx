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

interface ContentCardProps {
  title: string
  description?: string
  isDirty?: (currentValue: FormData, originalValue: FormData) => boolean
  inSync?: boolean
  intent?: ClientFormTypes
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
            className={styles.title}
            display="flex"
            justifyContent="spaceBetween"
            alignItems="baseline"
          >
            <Text ref={titleRef} marginTop={2} marginBottom={4} variant="h3">
              {title}
            </Text>
            {intent !== 'none' && (
              <Box>
                <DropdownMenu
                  title="Sync"
                  icon="chevronDown"
                  menuClassName={styles.menu}
                  items={[
                    {
                      title: '',
                      render: () => (
                        <>
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
                                ? 'Settings are the same in all environments.'
                                : 'SyncSettings are different in some enviroments'}
                            </Text>
                          </Box>
                          <Divider />
                        </>
                      ),
                    },
                    ...(inSync || dirty
                      ? []
                      : [
                          {
                            title: '',
                            render: () => (
                              <Box
                                display="flex"
                                justifyContent="center"
                                padding={2}
                              >
                                {checkIfLoadingForIntent() ? (
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
                                      Sync settings (from this environment)
                                    </Text>
                                  </button>
                                )}
                              </Box>
                            ),
                          },
                        ]),
                  ]}
                  key="sync-environment"
                />
              </Box>
            )}
          </Box>
          {description && <Text marginBottom={4}>{description}</Text>}
        </Box>
        {children}
        {intent !== 'none' && (
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
              name="intent"
              value={intent}
              loading={checkIfLoadingForIntent()}
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
      </Box>
    </Form>
  )
}

export default ContentCard
