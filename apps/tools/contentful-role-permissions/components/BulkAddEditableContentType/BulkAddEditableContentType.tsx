import { useMemo, useState } from 'react'
import { ContentTypeProps, RoleProps, TagProps } from 'contentful-management'
import slugify from '@sindresorhus/slugify'

import {
  Box,
  Button,
  Checkbox,
  Inline,
  Select,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'

import { policiesAreEditable } from '../../utils'
import * as styles from './BulkAddEditableContentType.css'

type Status = 'saving' | 'done' | 'error'

interface BulkAddEditableContentTypeProps {
  roles: RoleProps[]
  contentTypes: ContentTypeProps[]
  tags: TagProps[]
  onRoleUpdated: (role: RoleProps) => void
}

export const BulkAddEditableContentType = ({
  roles,
  contentTypes,
  tags,
  onRoleUpdated,
}: BulkAddEditableContentTypeProps) => {
  const [contentTypeId, setContentTypeId] = useState<string | null>(null)
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set())
  const [statuses, setStatuses] = useState<Record<string, Status>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const contentType = contentTypes.find((type) => type.sys.id === contentTypeId)

  const tagNames = useMemo(() => new Set(tags.map((tag) => tag.name)), [tags])

  const missingRoles = useMemo(
    () =>
      contentType
        ? roles.filter(
            (role) =>
              tagNames.has(slugify(role.name)) &&
              !policiesAreEditable(role, contentType),
          )
        : [],
    [contentType, roles, tagNames],
  )

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev)
      if (next.has(roleId)) next.delete(roleId)
      else next.add(roleId)
      return next
    })
  }

  const onApply = async () => {
    if (!contentTypeId) return
    setIsRunning(true)
    setStatuses({})

    let errorCount = 0

    // Save one role at a time, same as pressing save on each role card
    for (const role of missingRoles) {
      if (!selectedRoleIds.has(role.sys.id)) continue

      setStatuses((prev) => ({ ...prev, [role.sys.id]: 'saving' }))
      try {
        const response = await fetch('/api/add-editable-content-type', {
          method: 'PUT',
          body: JSON.stringify({ roleId: role.sys.id, contentTypeId }),
        })
        if (!response.ok) throw new Error(await response.text())

        onRoleUpdated(await response.json())
        setStatuses((prev) => ({ ...prev, [role.sys.id]: 'done' }))
        setSelectedRoleIds((prev) => {
          const next = new Set(prev)
          next.delete(role.sys.id)
          return next
        })
      } catch (err) {
        console.error(err)
        errorCount += 1
        setStatuses((prev) => ({ ...prev, [role.sys.id]: 'error' }))
      }
    }

    if (errorCount > 0) {
      toast.error(`Failed to update ${errorCount} role(s)`)
    } else {
      toast.success('Saved successfully')
    }
    setIsRunning(false)
  }

  const statusText = (status?: Status) => {
    if (status === 'saving') return 'Saving...'
    if (status === 'done') return 'Done'
    if (status === 'error') return 'Error'
    return ''
  }

  return (
    <Stack space={2}>
      <Box display="flex" justifyContent="flexEnd">
        <Button
          variant="text"
          size="small"
          icon={isOpen ? 'chevronUp' : 'chevronDown'}
          iconType="outline"
          disabled={isRunning}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Bulk actions
        </Button>
      </Box>

      {isOpen && (
        <Box
          border="standard"
          borderWidth="standard"
          borderRadius="standard"
          padding={3}
        >
          <Stack space={2}>
            <Text variant="h4">Add editable content type to roles</Text>
            <Select
              name="bulk-content-type"
              label="Content type"
              size="sm"
              isDisabled={isRunning}
              options={contentTypes.map((type) => ({
                label: `${type.name} (${type.sys.id})`,
                value: type.sys.id,
              }))}
              value={
                contentType
                  ? {
                      label: `${contentType.name} (${contentType.sys.id})`,
                      value: contentType.sys.id,
                    }
                  : null
              }
              onChange={(option) => {
                setContentTypeId(option?.value ?? null)
                setSelectedRoleIds(new Set())
                setStatuses({})
              }}
            />

            {contentType && (
              <Stack space={2}>
                <Inline justifyContent="spaceBetween" alignY="center" space={2}>
                  <Text variant="small">
                    {missingRoles.length} of {roles.length} roles can not edit{' '}
                    {contentType.name}
                  </Text>
                  <Inline space={2}>
                    <Button
                      variant="text"
                      size="small"
                      disabled={isRunning}
                      onClick={() =>
                        setSelectedRoleIds(
                          new Set(missingRoles.map((role) => role.sys.id)),
                        )
                      }
                    >
                      Select all
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      disabled={isRunning}
                      onClick={() => setSelectedRoleIds(new Set())}
                    >
                      Clear
                    </Button>
                    <Button
                      size="small"
                      disabled={selectedRoleIds.size === 0}
                      loading={isRunning}
                      onClick={onApply}
                    >
                      Save {selectedRoleIds.size} role(s)
                    </Button>
                  </Inline>
                </Inline>

                {missingRoles.length > 0 && (
                  <Box className={styles.roleList}>
                    <Stack space={1}>
                      {missingRoles.map((role) => (
                        <Inline
                          key={role.sys.id}
                          justifyContent="spaceBetween"
                          alignY="center"
                        >
                          <Checkbox
                            label={role.name}
                            disabled={isRunning}
                            checked={selectedRoleIds.has(role.sys.id)}
                            onChange={() => toggleRole(role.sys.id)}
                          />
                          <Text
                            variant="small"
                            color={
                              statuses[role.sys.id] === 'error'
                                ? 'red600'
                                : 'currentColor'
                            }
                          >
                            {statusText(statuses[role.sys.id])}
                          </Text>
                        </Inline>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
