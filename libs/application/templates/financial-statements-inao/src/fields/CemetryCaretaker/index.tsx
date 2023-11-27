import React, { FC, useState, useEffect, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { IdentityInput, Query } from '@island.is/api/schema'
import * as kennitala from 'kennitala'

import { RecordObject } from '@island.is/application/types'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  GridContainer,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { getValueViaPath, getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import * as styles from './CemetryCaretaker.css'
import { IdentityQuery } from '../../graphql'
import {
  BOARDMEMEBER,
  CARETAKER,
  APPLICANTASMEMBER,
  ACTORASCARETAKER,
  ACTORLONEBOARDMEMBER,
} from '../../lib/constants'
import { BoardMember } from '../../types'
import { getBoardmembersAndCaretakers } from '../../lib/utils/helpers'

type Props = {
  id: string
  index: number
  answers: FinancialStatementsInao
  handleRemoveCaretaker: (index: number) => void
  errors: RecordObject<unknown> | undefined
}

const CareTakerRepeaterItem = ({
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

export const CemetryCaretaker: FC<
  React.PropsWithChildren<FieldBaseProps<FinancialStatementsInao>>
> = ({ application, field, errors, setBeforeSubmitCallback }) => {
  const { formatMessage } = useLocale()
  const { id } = field

  const { getValues, setError } = useFormContext()
  const values = getValues()

  const { fields, append, remove } = useFieldArray({
    name: `${id}`,
  })

  const handleAddCaretaker = useCallback(() => {
    append({
      nationalId: '',
      name: '',
      role: '',
    })
  }, [append])

  const handleRemoveCaretaker = (index: number) => remove(index)

  useEffect(() => {
    if (fields.length === 0) handleAddCaretaker()
  }, [fields, handleAddCaretaker])

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      const actors = application.applicantActors
      const currentActor: string = actors[actors.length - 1]
      const allMembers = values.cemetryCaretaker
      const { careTakers, boardMembers } =
        getBoardmembersAndCaretakers(allMembers)
      const caretakersIncludeActor =
        careTakers.filter((careTaker) => careTaker === currentActor).length > 0

      const boardMembersIncludeActor =
        boardMembers.filter((boardMember) => boardMember === currentActor)
          .length > 0

      const includesApplicant =
        allMembers.filter(
          (member: BoardMember) => member.nationalId === application.applicant,
        ).length > 0

      if (caretakersIncludeActor) {
        setError(ACTORASCARETAKER, {
          type: 'custom',
          message: formatMessage(m.errorcaretakerCanNotIncludeActor),
        })
        return [false, formatMessage(m.errorcaretakerCanNotIncludeActor)]
      } else if (boardMembersIncludeActor && boardMembers.length <= 1) {
        setError(ACTORLONEBOARDMEMBER, {
          type: 'custom',
          message: formatMessage(m.errorcaretakerCanNotIncludeActor),
        })
        return [false, formatMessage(m.errorcaretakerCanNotIncludeActor)]
      } else if (includesApplicant) {
        setError(APPLICANTASMEMBER, {
          type: 'custom',
          message: formatMessage(m.errormemberCanNotIncludeApplicant),
        })
        return [false, formatMessage(m.errormemberCanNotIncludeApplicant)]
      } else {
        return [true, null]
      }
    })

  return (
    <GridContainer>
      {fields.map((field, index) => (
        <Box key={field.id}>
          <CareTakerRepeaterItem
            id={id}
            answers={application.answers}
            index={index}
            handleRemoveCaretaker={handleRemoveCaretaker}
            key={field.id}
            errors={errors}
          />
        </Box>
      ))}
      <GridRow>
        <Box paddingTop={2} paddingLeft="p2">
          <Button
            variant="ghost"
            icon="add"
            iconType="outline"
            size="small"
            onClick={handleAddCaretaker}
          >
            {formatMessage(m.add)}
          </Button>
        </Box>
      </GridRow>
      {errors && errors.cemetryCaretaker ? (
        <InputError
          errorMessage={
            typeof errors.cemetryCaretaker === 'string'
              ? errors.cemetryCaretaker
              : undefined
          }
        />
      ) : null}
      {errors && errors.applicantasmember ? (
        <InputError
          errorMessage={formatMessage(m.errormemberCanNotIncludeApplicant)}
        />
      ) : null}
      {errors && errors.actorascaretaker ? (
        <InputError
          errorMessage={formatMessage(m.errorcaretakerCanNotIncludeActor)}
        />
      ) : null}
      {errors && errors.actorloneboardmember ? (
        <InputError
          errorMessage={formatMessage(
            m.errorBoardmembersCanNotJustIncludeActor,
          )}
        />
      ) : null}
    </GridContainer>
  )
}
