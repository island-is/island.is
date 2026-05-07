'use client'

import { useEffect, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { FileUploadController } from '@island.is/application/ui-components'
import type { Application } from '@island.is/application/types'

import { useApplicationId } from '../../ApplicationContext'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

type FileAnswer = { name: string; key?: string }

const toFileAnswerArray = (value: unknown): FileAnswer[] => {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is FileAnswer => {
    if (typeof entry !== 'object' || entry === null) return false
    const candidate = entry as Record<string, unknown>
    return typeof candidate.name === 'string'
  })
}

const areFileAnswersEqual = (a: FileAnswer[], b: FileAnswer[]): boolean => {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].name !== b[i].name || a[i].key !== b[i].key) return false
  }
  return true
}

export const SdfFileUploadField = ({
  component,
  currentValue,
  error,
  answers,
  handleChange,
}: FieldRendererProps) => {
  const applicationId = useApplicationId()
  const fieldId = component.id ?? ''

  const initialValue = useMemo(
    () => toFileAnswerArray(currentValue),
    // Only use the initial value once; subsequent updates flow through the
    // react-hook-form -> handleChange bridge below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const methods = useForm<Record<string, FileAnswer[]>>({
    defaultValues: { [fieldId]: initialValue },
  })

  const lastSyncedRef = useRef<FileAnswer[]>(initialValue)

  useEffect(() => {
    const subscription = methods.watch((value) => {
      const next = toFileAnswerArray(value?.[fieldId])
      if (!areFileAnswersEqual(lastSyncedRef.current, next)) {
        lastSyncedRef.current = next
        handleChange(next)
      }
    })
    return () => subscription.unsubscribe()
  }, [methods, fieldId, handleChange])

  const application = useMemo(
    () =>
      ({
        id: applicationId,
        answers,
        externalData: {},
      } as unknown as Application),
    [applicationId, answers],
  )

  return (
    <FormProvider {...methods}>
      <Box marginBottom={3}>
        {component.introduction && (
          <FieldDescription description={component.introduction} />
        )}
        <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
          <FileUploadController
            id={fieldId}
            application={application}
            error={error}
            header={component.uploadHeader}
            description={component.uploadDescription}
            buttonLabel={component.uploadButtonLabel}
            multiple={component.uploadMultiple ?? false}
            accept={component.accept}
            maxSize={component.maxSize}
            maxSizeErrorText={component.maxSizeErrorText}
            totalMaxSize={component.totalMaxSize}
            maxFileCount={component.maxFileCount}
            forImageUpload={component.forImageUpload}
          />
        </Box>
      </Box>
    </FormProvider>
  )
}
