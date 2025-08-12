import { useEffect, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  Box,
  Button,
  GridRow,
  GridContainer,
  InputError,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/types'

import { FinancialStatementCemetery } from '../../lib/dataSchema'
import {
  APPLICANTASMEMBER,
  ACTORASCARETAKER,
  ACTORLONEBOARDMEMBER,
} from '../../utils/constants'

import { getBoardmembersAndCaretakers } from '../../utils/helpers'
import { CaretakerRepeaterItem } from './CemeteryCaretakerRepeaterItem'
import { BoardMember } from '../../types/types'

export const CemeteryCaretaker = ({
  application,
  field,
  errors,
  setBeforeSubmitCallback,
}: FieldBaseProps<FinancialStatementCemetery>) => {
  const { formatMessage } = useLocale()
  const { id } = field

  const { getValues, setError } = useFormContext()
  const values = getValues()

  const { fields, append, remove } = useFieldArray({
    name: id ?? '',
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

      const allMembers = values.cemeteryCaretaker
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
          message: formatMessage(m.errorCaretakerCanNotIncludeActor),
        })
        return [false, formatMessage(m.errorCaretakerCanNotIncludeActor)]
      } else if (boardMembersIncludeActor && boardMembers.length <= 1) {
        setError(ACTORLONEBOARDMEMBER, {
          type: 'custom',
          message: formatMessage(m.errorCaretakerCanNotIncludeActor),
        })
        return [false, formatMessage(m.errorCaretakerCanNotIncludeActor)]
      } else if (includesApplicant) {
        setError(APPLICANTASMEMBER, {
          type: 'custom',
          message: formatMessage(m.errorMemberCanNotIncludeApplicant),
        })
        return [false, formatMessage(m.errorMemberCanNotIncludeApplicant)]
      } else {
        return [true, null]
      }
    })

  return (
    <GridContainer>
      {fields.map((field, index) => (
        <Box key={field.id}>
          <CaretakerRepeaterItem
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
      {errors && errors.cemeteryCaretaker ? (
        <InputError
          errorMessage={
            typeof errors.cemeteryCaretaker === 'string'
              ? errors.cemeteryCaretaker
              : undefined
          }
        />
      ) : null}
      {errors && errors.applicantasmember ? (
        <InputError
          errorMessage={formatMessage(m.errorMemberCanNotIncludeApplicant)}
        />
      ) : null}
      {errors && errors.actorascaretaker ? (
        <InputError
          errorMessage={formatMessage(m.errorCaretakerCanNotIncludeActor)}
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
