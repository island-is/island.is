import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { isPerson } from 'kennitala'
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
  studentName: `${prefix}.studentName`,
  studentMentorability: `${prefix}.studentMentorability`,
  studentMentorabilityError: `${prefix}.studentMentorabilityError`,
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
    onError: () => {
      setError(fieldNames.lookupError, {
        type: 'serverError',
        message: m.errorNationalIdNoName.defaultMessage,
      })
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
    onError: () => {
      setError(fieldNames.studentMentorabilityError, {
        type: 'serverError',
        message: m.errorNationalIdMentorableLookup.defaultMessage,
      })
      setValue(fieldNames.studentMentorability, 'isNotMentorable')
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
          fieldNames.studentMentorability,
          eligible ? 'isMentorable' : 'isNotMentorable',
        )
      }
    },
  })

  // Clear inital errors on mount
  useEffect(() => {
    clearErrors()
  }, [])

  const studentNationalId: string = watch(fieldNames.studentNationalId)
  const studentName: string = watch(fieldNames.studentName)

  const studentMentorability = getValues(fieldNames.studentMentorability)

  useEffect(() => {
    if (isPerson(studentNationalId)) {
      if (fakeData?.useFakeData === YES) {
        const fakeEligible = fakeData?.mentorableStudents
          ?.split(',')
          .some((e) => e.trim() === studentNationalId)
        let fakeMentorability = 'isNotMentorable'
        let fakeName = 'Óleyf Keyra Vagnsdóttir'
        if (fakeEligible) {
          fakeMentorability = 'isMentorable'
          fakeName = 'Æfinga Leyfisbur'
        }
        setValue(fieldNames.studentMentorability, fakeMentorability)
        setValue(fieldNames.studentName, fakeName)
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
        setValue(fieldNames.studentMentorability, 'loading')
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
            id={fieldNames.studentMentorability}
            name={fieldNames.studentMentorability}
            readOnly
            defaultValue="default"
          />
        </Box>
      </GridRow>

      <GridRow marginTop={5}>
        <GridColumn span="12/12">
          {studentMentorability !== 'default' && (
            <ContentBlock>
              {studentMentorability === 'loading' && (
                <AlertMessage
                  type="info"
                  title={formatMessage(m.studentIsMentorableLoadingHeader)}
                  message={formatMessage(
                    m.studentIsMentorableLoadingDescription,
                  )}
                />
              )}
              {studentMentorability === 'isMentorable' && (
                <AlertMessage
                  type="success"
                  title={formatMessage(m.studentIsMentorableHeader)}
                  message={formatMessage(m.studentIsMentorableDescription)}
                />
              )}
              {studentMentorability === 'isNotMentorable' && (
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
