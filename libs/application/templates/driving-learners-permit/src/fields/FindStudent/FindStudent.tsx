import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'
import * as kennitala from 'kennitala'
import {
  AlertMessage,
  Box,
  ContentBlock,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import {
  IdentityInput,
  Query,
  StudentMentorabilityInput,
} from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql/'
import { STUDENT_MENTORABILITY_QUERY } from '../../graphql'

interface FindStudentFieldBaseProps extends FieldBaseProps {
  errors: FieldErrors<FieldValues>
}

const prefix = 'studentMentorability'

const fieldNames = {
  studentNationalId: `${prefix}.studentNationalId`,
  lookupError: `${prefix}.lookupError`,
  studentMentorabilityError: `${prefix}.studentMentorabilityError`,
  studentName: `${prefix}.studentName`,
  studentIsMentorable: `${prefix}.studentIsMentorable`,
}

const FindStudent: FC<FindStudentFieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const {
    setValue,
    watch,
    errors,
    clearErrors,
    setError,
    getValues,
  } = useFormContext()
  const [getIdentity, { loading: identityQueryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IDENTITY_QUERY, {
    onError: (error: unknown) => {
      setError(fieldNames.lookupError, {
        type: 'serverError',
        message: m.errorNationalIdNoName.defaultMessage,
      })
      console.log('getIdentity error:', error)
    },
    onCompleted: (data) => {
      if (data.identity?.name) {
        clearErrors(fieldNames.lookupError)
        clearErrors(fieldNames.studentName)
        setValue(fieldNames.studentName, data.identity?.name ?? '')
      } else {
        setError(fieldNames.lookupError, {
          type: 'serverError',
          message: m.errorNationalIdNoName.defaultMessage,
        })
      }
    },
  })

  const [
    getStudentMentorability,
    { loading: studentQueryLoading },
  ] = useLazyQuery<Query, { input: StudentMentorabilityInput }>(
    STUDENT_MENTORABILITY_QUERY,
    {
      onError: (error: unknown) => {
        setError(fieldNames.studentMentorabilityError, {
          type: 'serverError',
          message: m.errorNationalIdMentorableLookup.defaultMessage,
        })
        console.log('getStudentMentorabilityError:', error)
      },
      onCompleted: (data) => {
        if (data.studentMentorability) {
          clearErrors(fieldNames.studentMentorabilityError)
          setValue(
            fieldNames.studentIsMentorable,
            data.studentMentorability.isMentorable
              ? 'isMentorable'
              : 'isNotMentorable',
          )
        }
      },
    },
  )

  // Clear inital errors on mount
  useEffect(() => {
    clearErrors()
  }, [])

  const studentNationalId: string = watch(fieldNames.studentNationalId)
  const studentName: string = watch(fieldNames.studentName)

  useEffect(() => {
    if (studentNationalId?.length === 10) {
      const isValidSSN = kennitala.isPerson(studentNationalId)
      if (isValidSSN) {
        const nationalIdInput = {
          variables: {
            input: {
              nationalId: studentNationalId,
            },
          },
        }
        getIdentity(nationalIdInput)
        getStudentMentorability(nationalIdInput)
      } else if (studentName !== '') {
        setValue(fieldNames.studentName, '')
      }
    } else if (studentName !== '') {
      setValue(fieldNames.studentName, '')
    }
  }, [studentName, studentNationalId, getIdentity, setValue])

  return (
    <Box marginTop={5}>
      <Text>
        {formatText(m.studentInfoHeading, application, formatMessage)}
      </Text>
      <GridRow marginBottom={2} marginTop={2}>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.studentNationalId}
            name={fieldNames.studentNationalId}
            label={formatText(
              m.studentNationalIdLabel,
              application,
              formatMessage,
            )}
            format="######-####"
            defaultValue=""
            backgroundColor="blue"
            icon={studentName ? 'checkmarkCircle' : undefined}
            loading={identityQueryLoading}
            error={
              errors?.pickRole?.electPerson?.lookupError?.message ||
              errors?.pickRole?.electPerson?.electedPersonNationalId ||
              undefined
            }
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.studentName}
            name={fieldNames.studentName}
            label={formatText(m.studentNameLabel, application, formatMessage)}
            readOnly
            defaultValue=""
          />
        </GridColumn>
        <Box hidden={true}>
          <InputController
            id={fieldNames.studentIsMentorable}
            name={fieldNames.studentIsMentorable}
            readOnly
            defaultValue="default"
          />
        </Box>
      </GridRow>

      <GridRow marginBottom={2} marginTop={2}>
        <GridColumn span="12/12">
          {getValues(fieldNames.studentIsMentorable) !== 'default' && (
            <ContentBlock>
              {getValues(fieldNames.studentIsMentorable) === 'isMentorable' && (
                <AlertMessage
                  type="success"
                  title={formatMessage(m.studentIsMentorableHeader)}
                  message={formatMessage(m.studentIsMentorableDescription)}
                />
              )}
              {getValues(fieldNames.studentIsMentorable) ===
                'isNotMentorable' && (
                <AlertMessage
                  type="error"
                  title={formatMessage(m.studentIsNotMentorableHeader)}
                  message={formatMessage(m.studentIsNotMentorableDescription)}
                />
              )}
            </ContentBlock>
          )}
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export { FindStudent }
