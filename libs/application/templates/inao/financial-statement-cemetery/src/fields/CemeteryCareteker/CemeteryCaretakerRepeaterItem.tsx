import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'

import { RecordObject } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  GridContainer,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { getValueViaPath, getErrorViaPath } from '@island.is/application/core'

import { FinancialStatementCemetery } from '../../lib/dataSchema'
import * as styles from './CemeteryCaretaker.css'
import { IdentityQuery } from '../../graphql'
import { BOARDMEMEBER, CARETAKER } from '../../utils/constants'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'

type Props = {
  id: string
  index: number
  answers: FinancialStatementCemetery
  handleRemoveCaretaker: (index: number) => void
  errors: RecordObject<unknown> | undefined
}

export const CaretakerRepeaterItem = ({
  id,
  index,
  answers,
  errors,
  handleRemoveCaretaker,
}: Props) => {
  const { formatMessage } = useLocale()

  const [nationalIdInput, setNationalIdInput] = useState('')

  const { clearErrors, setValue } = useFormContext()

  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const nationalIdField = `${fieldIndex}.nationalId`
  const roleField = `${fieldIndex}.role`

  const [getIdentity, { loading, error: queryError }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IdentityQuery, {
    onCompleted: (data) => {
      setValue(nameField, data.identity?.name ?? '')
    },
  })

  useEffect(() => {
    clearErrors()
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [nationalIdInput, getIdentity, clearErrors])

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box position="relative" paddingTop={3} paddingRight={1}>
            <InputController
              id={nationalIdField}
              name={nationalIdField}
              label={formatMessage(m.nationalId)}
              backgroundColor="blue"
              format="######-####"
              onChange={(v) =>
                setNationalIdInput(v.target.value.replace(/\W/g, ''))
              }
              error={errors && getErrorViaPath(errors, nationalIdField)}
              defaultValue={
                getValueViaPath(answers, nationalIdField, '') as string
              }
            />
          </Box>
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box position="relative" paddingTop={3} paddingRight={1}>
            {index > 0 && (
              <Box position="absolute" className={styles.removeFieldButton}>
                <Button
                  variant="ghost"
                  size="small"
                  circle
                  icon="remove"
                  onClick={() => {
                    handleRemoveCaretaker(index)
                  }}
                />
              </Box>
            )}
            <InputController
              id={nameField}
              name={nameField}
              label={formatMessage(m.fullName)}
              backgroundColor="blue"
              loading={loading}
              readOnly
              error={
                queryError
                  ? formatMessage(m.errorNationalIdIncorrect)
                  : undefined
              }
            />
          </Box>
        </GridColumn>
      </GridRow>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box paddingTop={2} paddingRight={1}>
            <SelectController
              id={roleField}
              name={roleField}
              label={formatMessage(m.role)}
              placeholder={formatMessage(m.selectRole)}
              backgroundColor="blue"
              error={errors && getErrorViaPath(errors, roleField)}
              options={[
                {
                  label: formatMessage(m.cemeteryInspector),
                  value: CARETAKER,
                },
                {
                  label: formatMessage(m.cemeteryBoardMember),
                  value: BOARDMEMEBER,
                },
              ]}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
