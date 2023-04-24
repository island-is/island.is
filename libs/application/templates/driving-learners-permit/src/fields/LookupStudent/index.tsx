import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import {
  AlertMessage,
  Box,
  ContentBlock,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import {
  IdentityInput,
  Query,
  StudentCanGetPracticePermitInput,
} from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql'
import { LOOKUP_STUDENT_QUERY } from '../../graphql'
import { LearnersPermitFakeData, YES } from '../../lib/constants'

const prefix = 'studentMentorability'

const fieldNames = {
  studentNationalId: `${prefix}.studentNationalId`,
  lookupError: `${prefix}.lookupError`,
  studentMentorabilityError: `${prefix}.studentMentorabilityError`,
  studentName: `${prefix}.studentName`,
  studentIsMentorable: `${prefix}.studentIsMentorable`,
}

export const LookupStudent: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const fakeData = getValueViaPath<LearnersPermitFakeData>(
    application.answers,
    'fakeData',
  )
  const { setValue, watch, clearErrors, setError, getValues } = useFormContext()
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

  const [getStudentMentorability] = useLazyQuery<
    Query,
    { input: StudentCanGetPracticePermitInput }
  >(LOOKUP_STUDENT_QUERY, {
    onError: (error: unknown) => {
      setError(fieldNames.studentMentorabilityError, {
        type: 'serverError',
        message: m.errorNationalIdMentorableLookup.defaultMessage,
      })
      setValue(fieldNames.studentIsMentorable, 'isNotMentorable')
      console.log('getStudentMentorabilityError:', error)
    },
    onCompleted: (data) => {
      if (data.drivingLicenseStudentCanGetPracticePermit) {
        clearErrors(fieldNames.studentMentorabilityError)
        const {
          isOk,
          errorCode,
        } = data.drivingLicenseStudentCanGetPracticePermit
        const eligible = isOk && errorCode === null
        setValue(
          fieldNames.studentIsMentorable,
          eligible ? 'isMentorable' : 'isNotMentorable',
        )
      }
    },
  })

  const studentIsMentorable = getValues(fieldNames.studentIsMentorable)

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
        if (fakeData?.useFakeData === YES) {
          if (
            fakeData?.mentorableStudents
              ?.split(',')
              .map((v) => v.trim())
              .includes(studentNationalId)
          ) {
            setValue(fieldNames.studentIsMentorable, 'isMentorable')
            setValue(fieldNames.studentName, 'Æfinga Leyfisbur')
          } else {
            setValue(fieldNames.studentIsMentorable, 'isNotMentorable')
            setValue(fieldNames.studentName, 'Óleyf Keyra Vagnsdóttir')
          }
        } else {
          const identityInput = {
            variables: {
              input: {
                nationalId: studentNationalId,
              },
            },
          }
          const studentLookupInput = {
            variables: {
              input: {
                studentSSN: studentNationalId,
              },
            },
          }
          getIdentity(identityInput)
          getStudentMentorability(studentLookupInput)
          setValue(fieldNames.studentIsMentorable, 'loading')
        }
      } else if (studentName !== '') {
        setValue(fieldNames.studentName, '')
      }
    } else if (studentName !== '') {
      setValue(fieldNames.studentName, '')
    }
  }, [studentName, studentNationalId, getIdentity, setValue])

  return (
    <Box>
      <GridRow marginBottom={2} marginTop={2}>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.studentNationalId}
            name={fieldNames.studentNationalId}
            label={formatMessage(m.studentNationalIdLabel)}
            format="######-####"
            defaultValue=""
            backgroundColor="blue"
            loading={identityQueryLoading}
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.studentName}
            name={fieldNames.studentName}
            label={formatMessage(m.studentNameLabel)}
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

      <GridRow marginTop={5}>
        <GridColumn span="12/12">
          {studentIsMentorable !== 'default' && (
            <ContentBlock>
              {studentIsMentorable === 'loading' && (
                <AlertMessage
                  type="info"
                  title={formatMessage(m.studentIsMentorableLoadingHeader)}
                  message={formatMessage(
                    m.studentIsMentorableLoadingDescription,
                  )}
                />
              )}
              {studentIsMentorable === 'isMentorable' && (
                <AlertMessage
                  type="success"
                  title={formatMessage(m.studentIsMentorableHeader)}
                  message={formatMessage(m.studentIsMentorableDescription)}
                />
              )}
              {studentIsMentorable === 'isNotMentorable' && (
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

export default LookupStudent
