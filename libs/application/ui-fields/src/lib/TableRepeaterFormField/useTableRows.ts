import { coreErrorMessages } from '@island.is/application/core'
import { SetBeforeSubmitCallback } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { uuid } from 'uuidv4'
import { setObjectWithNestedKey } from './utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableRepeaterRow = Record<string, any> & {
  isUnsaved?: boolean
  isRemoved?: boolean
}
export type TableRepeaterForm = Record<string, TableRepeaterRow[]>

const isSaved = (row: TableRepeaterRow) => !row.isUnsaved && !row.isRemoved

type Options = {
  id: string
  initActiveFieldIfEmpty?: boolean
  getDefaultRows: () => unknown
  onSaved: (rows: TableRepeaterRow[]) => Promise<void>
  setBeforeSubmitCallback?: SetBeforeSubmitCallback
}

export const useTableRows = ({
  id,
  initActiveFieldIfEmpty,
  getDefaultRows,
  onSaved,
  setBeforeSubmitCallback,
}: Options) => {
  const { formatMessage } = useLocale()
  const methods = useFormContext<TableRepeaterForm>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const { fields, append, remove, update } = useFieldArray({
    control: methods.control,
    name: id,
  })

  const values = useWatch({
    control: methods.control,
    name: id,
  })

  const [activeIndex, setActiveIndex] = useState(
    fields?.findIndex((x) => x?.isUnsaved) ?? -1,
  )
  const activeField = activeIndex >= 0 ? fields[activeIndex] : null

  const savedRows = fields.filter(isSaved)
  const isShown = (index: number) =>
    index !== activeIndex && isSaved(fields[index])
  const displayIndex = (index: number) =>
    savedRows.findIndex((f) => f.id === fields[index].id)

  const safeUpdate = (index: number, changes: Partial<TableRepeaterRow>) => {
    const current = methods.getValues(`${id}.${index}`) || {}
    update(index, { ...current, ...changes })
  }

  const saveRow = async (index: number) => {
    const isValid = await methods.trigger(`${id}[${index}]`, {
      shouldFocus: true,
    })

    if (isValid) {
      safeUpdate(index, { isUnsaved: false })
      setActiveIndex(-1)
      await onSaved(values)
      setIsEditing(false)
    }
  }

  const cancelRow = (index: number) => {
    setActiveIndex(-1)
    if (!isEditing) {
      remove(index)
    }
    setIsEditing(false)
  }

  const addRow = () => {
    append({ isUnsaved: true })
    setActiveIndex(fields.length)
    methods.clearErrors()
  }

  const removeRow = (index: number) => {
    safeUpdate(index, { isRemoved: true })
    if (activeIndex === index) setActiveIndex(-1)
  }

  const editRow = (index: number) => {
    setActiveIndex(index)
    setIsEditing(true)
  }

  // If the list is empty and initActiveFieldIfEmpty=true,
  // start with one row opened in edit mode
  useEffect(() => {
    const oldValues = methods.getValues(id) || []
    if (initActiveFieldIfEmpty && oldValues.length === 0) {
      // Using setObjectValue to handle nested ids
      const newValues = {}
      setObjectWithNestedKey(newValues, id, [{ isUnsaved: true }])
      methods.reset({
        ...newValues,
      })
      setActiveIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initialize with default values on mount
  // only if no existing values are present and defaultValues is defined/non-empty
  useEffect(() => {
    const defaultValues = getDefaultRows()
    const oldValues = methods.getValues(id) || []
    if (defaultValues && oldValues.length === 0) {
      // Using setObjectValue to handle nested ids
      const newValues = {}
      setObjectWithNestedKey(newValues, id, defaultValues)
      const existingValues = methods.getValues()
      methods.reset({
        ...existingValues,
        ...newValues,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep activeIndex in a ref so setBeforeSubmit callback always has latest value
  const activeIndexRef = useRef(activeIndex)
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Register a beforeSubmit callback that blocks form submission until the active registration is completed
  // Persist a unique callback ID across renders to avoid re-registering in setBeforeSubmitCallback
  const callbackIdRef = useRef(`TableRepeaterFormField-${uuid()}`)
  useEffect(() => {
    setBeforeSubmitCallback?.(
      async () => {
        if (activeIndexRef.current !== -1) {
          setErrorMessage(
            formatMessage(coreErrorMessages.needToFinishRegistration),
          )
          return [
            false,
            formatMessage(coreErrorMessages.needToFinishRegistration),
          ]
        }

        // Remove deleted rows
        // Iterate in reverse so removing doesn't break indices
        for (let i = fields.length - 1; i >= 0; i--) {
          const row = fields[i]
          if (row.isRemoved) {
            remove(i)
          }
        }

        setErrorMessage(null)
        return [true, null]
      },
      { allowMultiple: true, customCallbackId: callbackIdRef.current },
    )
  }, [fields, formatMessage, remove, setBeforeSubmitCallback])

  return {
    fields,
    values,
    activeIndex,
    activeField,
    savedCount: savedRows.length,
    isShown,
    displayIndex,
    errorMessage,
    addRow,
    saveRow,
    cancelRow,
    removeRow,
    editRow,
  }
}
