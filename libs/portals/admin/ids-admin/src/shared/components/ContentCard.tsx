import React, { FC, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  DropdownMenu,
  Icon,
  Text,
} from '@island.is/island-ui/core'
import { Form } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { ClientFormTypes } from '../../components/forms/EditApplication/EditApplication.action'
import { AuthAdminEnvironment } from '@island.is/api/schema'
import * as styles from './ContentCard.css'

interface ContentCardProps {
  title: string
  onSave?: (saveOnAllEnvironments: boolean) => void
  description?: string
  isDirty?: (currentValue: FormData, originalValue: FormData) => boolean
  inSync?: boolean
  intent?: ClientFormTypes | 'none'
  selectedEnvironment?: AuthAdminEnvironment
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
  onSave,
  isDirty = defaultIsDirty,
  inSync = false,
  intent = 'none',
  selectedEnvironment,
}) => {
  const { formatMessage } = useLocale()
  const [allEnvironments, setAllEnvironments] = useState<boolean>(false)
  const originalFormData = useRef<FormData>()
  const [dirty, setDirty] = useState<boolean>(false)
  const ref = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [offset, setOffset] = useState<number>(0)

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

  useEffect(() => {
    setOffset(titleRef.current?.offsetTop ?? 0)
  }, [titleRef])

  // On mount, set the original form data
  useEffect(() => {
    originalFormData.current = new FormData(ref.current as HTMLFormElement)
  }, [ref])
  return (
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
        <Box className={styles.title}>
          <Text ref={titleRef} marginTop={2} marginBottom={4} variant="h3">
            {title}
          </Text>
        </Box>
        {description && <Text marginBottom={4}>{description}</Text>}
      </Box>
      <Form ref={ref} onChange={onChange} method="post">
        {intent !== 'none' && (
          <Box
            justifyContent="flexEnd"
            style={{ top: offset }}
            display="flex"
            position="absolute"
            right={4}
          >
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
                            <button
                              className={styles.syncButton}
                              type="submit"
                              value={intent}
                              name="intent"
                            >
                              <Text
                                variant="small"
                                color="blue400"
                                fontWeight="semiBold"
                              >
                                Sync settings (from this environment)
                              </Text>
                            </button>
                          </Box>
                        ),
                      },
                    ]),
              ]}
              key="sync-environment"
            />
          </Box>
        )}
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
            {/*hidden input to pass the selected environment to the form*/}
            <input
              type="hidden"
              name="environment"
              value={selectedEnvironment}
            />
          </Box>
        )}
      </Form>
    </Box>
  )
}

export default ContentCard
