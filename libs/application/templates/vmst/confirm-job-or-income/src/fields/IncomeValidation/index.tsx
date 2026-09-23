import { FieldBaseProps } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { useApolloClient } from '@apollo/client/react'
import { useLocale } from '@island.is/localization'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
} from '@island.is/island-ui/core'
import { FC, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { uuid } from 'uuidv4'
import {
  IncomeValidationAlert,
  IncomeValidationInput,
  IncomeValidationMessages,
  IncomeValidationRow,
  validateIncomes,
} from '../../utils/validateIncomes'
import { BuildDelete, splitEntries } from '../../utils/reconcile'

// Which array in IncomeValidationInput the mapped rows should be placed under.
type IncomeTypeKey = keyof IncomeValidationInput

type PersistedRecord = Record<string, unknown> & { id?: string }

export type IncomeValidationFieldProps = {
  fieldId: string
  incomeTypeKey: IncomeTypeKey
  // externalData path to the persisted array we reconcile against.
  persistedPath: string
  rowToInput: (
    row: IncomeValidationRow,
  ) => NonNullable<IncomeValidationInput[IncomeTypeKey]>[number]
  messages: IncomeValidationMessages
  callbackId: string
  // Optional per-type delete marker builder; Galdur requires employerSSN for
  // partTime / irregular deletes, other types pass a bare { id, deleted: true }.
  buildDelete?: BuildDelete<PersistedRecord>
}

// Injected via buildCustomField's second argument; intersected with FieldBaseProps
// so field.props is strongly typed at the call site.
type IncomeValidationComponentProps = FieldBaseProps & {
  field: { props: IncomeValidationFieldProps }
}

type AlertState = IncomeValidationAlert | null

export const IncomeValidation: FC<
  React.PropsWithChildren<IncomeValidationComponentProps>
> = (props) => {
  const { setBeforeSubmitCallback, field, application } = props
  const { getValues, setValue } = useFormContext()
  const apolloClient = useApolloClient()
  const { formatMessage, lang } = useLocale()
  const [alert, setAlert] = useState<AlertState>(null)
  const validationPromiseRef = useRef<Promise<
    [true, null] | [false, string]
  > | null>(null)

  const {
    fieldId,
    incomeTypeKey,
    persistedPath,
    rowToInput,
    messages,
    callbackId,
    buildDelete,
  } = field.props

  useEffect(() => {
    setBeforeSubmitCallback?.(
      async () => {
        if (validationPromiseRef.current) {
          return validationPromiseRef.current
        }

        validationPromiseRef.current = (async () => {
          const rawRows =
            (getValues(fieldId) as IncomeValidationRow[] | undefined) ?? []

          if (!rawRows.length) {
            setAlert(null)
            return [true, null]
          }

          const rowsWithValidationIds = rawRows.map((row, index) => {
            if (row.validationId) return row

            const validationId = uuid()
            setValue(`${fieldId}[${index}].validationId`, validationId)
            return { ...row, validationId }
          })

          const persisted =
            getValueViaPath<PersistedRecord[]>(
              application.externalData,
              persistedPath,
            ) ?? []

          const { creates, deletes } = splitEntries(
            rowsWithValidationIds,
            persisted,
            'validationId',
            buildDelete,
          )

          if (!creates.length && !deletes.length) {
            setAlert(null)
            return [true, null]
          }

          const input: IncomeValidationInput = {
            [incomeTypeKey]: [...creates.map(rowToInput), ...deletes],
          }

          const { pathItems, isValid, alert } = await validateIncomes({
            apolloClient,
            fieldId,
            rawRows: rowsWithValidationIds,
            input,
            formatMessage,
            locale: lang,
            messages,
          })

          pathItems.forEach(({ path, value }) => setValue(path, value))
          setAlert(alert)

          return isValid ? [true, null] : [false, '']
        })()

        try {
          return await validationPromiseRef.current
        } finally {
          validationPromiseRef.current = null
        }
      },
      { allowMultiple: true, customCallbackId: callbackId },
    )
    // rowToInput/messages/buildDelete are section-scoped const references, so
    // their identity is stable and the effect re-runs only when the actual
    // configuration changes (never in practice while the section is mounted).
  }, [
    apolloClient,
    application.externalData,
    buildDelete,
    callbackId,
    fieldId,
    formatMessage,
    getValues,
    incomeTypeKey,
    lang,
    messages,
    persistedPath,
    rowToInput,
    setBeforeSubmitCallback,
    setValue,
  ])

  if (!alert) return null

  return (
    <Box marginTop={6}>
      <AlertMessage
        type="warning"
        title={alert.title}
        message={
          alert.kind === 'lines' ? (
            <Box marginTop={1}>
              <BulletList space={1}>
                {alert.lines.map((line, index) => (
                  <Bullet key={index}>{line}</Bullet>
                ))}
              </BulletList>
            </Box>
          ) : (
            alert.message
          )
        }
      />
    </Box>
  )
}
