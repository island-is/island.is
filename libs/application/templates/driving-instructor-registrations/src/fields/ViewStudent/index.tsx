import React, { useCallback, useState, useEffect } from 'react'
import {
  Button,
  Text,
  Box,
  Stack,
  RadioButton,
  Input,
  DatePicker,
  Icon,
  toast,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { minutesOfDriving } from '../../shared/constants'
import format from 'date-fns/format'
import * as styles from '../style.css'
import cn from 'classnames'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQuery, useMutation } from '@apollo/client'
import { StudentOverView, Lesson } from '../../types/schema'
import { ViewSingleStudentQuery } from '../../graphql/queries'
import {
  RegisterDrivingLesson,
  DeleteDrivingLesson,
  EditDrivingLesson,
} from '../../graphql/mutations'
import Skeleton from './Skeleton'

interface Props {
  studentSsn: string
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewStudent = ({ studentSsn, setShowTable }: Props) => {
  const { formatMessage } = useLocale()

  const { data, loading, refetch: refetchStudent } = useQuery(
    ViewSingleStudentQuery,
    {
      variables: {
        input: {
          ssn: studentSsn,
        },
      },
    },
  )
  const [
    registerLesson,
    { data: registrationId, loading: loadingRegistration },
  ] = useMutation(RegisterDrivingLesson)
  const [
    deleteLesson,
    { data: deleteSuccess, loading: loadingDeletion },
  ] = useMutation(DeleteDrivingLesson)
  const [
    editLesson,
    { data: editSuccess, loading: loadingEdition },
  ] = useMutation(EditDrivingLesson)

  const [minutes, setMinutes] = useState(30)
  const [date, setDate] = useState<string>('')
  const [newRegId, setNewRegId] = useState<undefined | string>(undefined)
  const [editingRegistration, setEditingRegistration] = useState<
    undefined | Lesson
  >(undefined)
  const [dateError, setDateError] = useState(false)
  const [student, setStudent] = useState<undefined | StudentOverView>(
    data ? data.student.data : {},
  )

  const studentRegistrations = student?.books
    ? (student?.books[0].teachersAndLessons as Array<Lesson>)
    : []

  console.log(student)

  useEffect(() => {
    setStudent(data ? data.student.data : {})
  }, [data])

  const goBack = useCallback(() => {
    setShowTable(true)
  }, [setShowTable])

  const resetFields = () => {
    setEditingRegistration(undefined)
    setNewRegId(undefined)

    setDate('')
    setMinutes(30)

    refetchStudent()
  }

  const saveChanges = async () => {
    const success = await registerLesson({
      variables: {
        input: {
          practicalDrivingLessonCreateRequestBody: {
            createdOn: date,
            teacherSsn: '1003602259',
            minutes: minutes,
            bookId: student?.books ? student?.books[0].id : '',
            comments: 'TEST',
          },
        },
      },
    }).catch(() => {
      toast.error('Ekki tókst að skrá ökutíma')
    })

    if (success) {
      resetFields()
      toast.success('Skráning tókst')
    }
  }

  const editChanges = async () => {
    const success = await registerLesson({
      variables: {
        input: {
          id: editingRegistration?.id?.toLowerCase(),
          practicalDrivingLessonUpdateRequestBody: {
            minutes: minutes,
            createdOn: date,
            comments: '',
          },
        },
      },
    }).catch(() => {
      toast.error('Ekki tókst að breyta ökutíma')
    })

    if (success) {
      resetFields()
      toast.success('Breyting tókst')
    }
  }

  const deleteRegistration = async (regId: any) => {
    const res = await deleteLesson({
      variables: {
        input: {
          id: regId,
          reason: '',
        },
      },
    }).catch(() => {
      toast.error('Ekki tókst að eyða skráningu')
    })

    if (res && res.data.deletePracticalDrivingLesson.success) {
      resetFields()
      toast.success('Skráningu hefur verið eytt')
    }
  }

  return (
    <Box>
      {student && Object.entries(student).length > 0 ? (
        <Stack space={5}>
          <Box display={'flex'} justifyContent={'spaceBetween'}>
            <Box display={'block'}>
              <Text variant="h4">{formatMessage(m.viewStudentName)}</Text>
              <Text variant="default">{student.name}</Text>
            </Box>
            <Box display={'block'}>
              <Text variant="h4">{formatMessage(m.viewStudentNationalId)}</Text>
              <Text variant="default">{student.ssn}</Text>
            </Box>
            <Box display={'block'}>
              <Text variant="h4">{formatMessage(m.viewStudentCompleteHours)}</Text>
              <Text variant="default">{student.books ? student.books[0]?.totalLessonCount : 0}</Text>
            </Box>
          </Box>
          <Box display={'flex'} justifyContent={'spaceBetween'}>
            <Box display={'block'}>
              <Text variant="h4">
                {formatMessage(m.viewStudentCompleteSchools)}
              </Text>
              {student.books && student.books[0]?.drivingSchoolExams?.map((school, key) => {
                return (
                  <Text key={key} variant="default">{school.schoolTypeName}</Text>
                )
              })}
            </Box>
            <Box display={'block'}>
              <Text variant="h4">{formatMessage(m.viewStudentExamsComplete)}</Text>
              {student.books && student.books[0]?.testResults?.map((test, key) => {
                return (
                  <Text key={key} variant="default">{test.testTypeName}</Text>
                )
              })}
            </Box>
          </Box>
    
          <Box>
            <Text variant="h4">{formatMessage(m.viewStudentRegisterMinutes)}</Text>
            <Box marginTop={2}>
              <Box display="flex" justifyContent="spaceBetween">
                {minutesOfDriving.map((item, index) => {
                  return (
                    <Box key={'radioButton-' + index}>
                      <RadioButton
                        name={'options-' + index}
                        label={item.label}
                        value={item.value}
                        checked={item.value === minutes}
                        onChange={() => {
                          setMinutes(item.value)
                        }}
                        large
                      />
                    </Box>
                  )
                })}
                <Box style={{ width: '200px' }}>
                  <Input
                    label={formatMessage(m.viewStudentSelectDateLabel)}
                    type="number"
                    name="mínútur"
                    placeholder="0"
                    onChange={(input) => {
                      setMinutes(Number.parseInt(input.target.value, 10))
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
    
          <Box display="flex" justifyContent="spaceBetween">
            <Box display="flex">
              <DatePicker
                hasError={dateError}
                errorMessage="Veldu dagsetningu"
                handleChange={(date) => {
                  setDate(format(date, 'yyyy-MM-dd'))
                  setDateError(false)
                }}
                label={formatMessage(m.viewStudentSelectDateLabel)}
                locale="is"
                placeholderText={formatMessage(m.viewStudentSelectDatePlaceholder)}
                required
                selected={date ? new Date(date) : null}
              />
    
              <Box marginLeft={3} display="flex">
                <Button
                  loading={loadingRegistration}
                  onClick={() =>
                    date !== ''
                      ? !editingRegistration
                        ? saveChanges()
                        : editChanges()
                      : setDateError(true)
                  }
                >
                  {!editingRegistration
                    ? formatMessage(m.viewStudentSelectRegisterButton)
                    : 'Breyta'}
                </Button>
              </Box>
            </Box>
    
            {editingRegistration && (
              <Box>
                <Button
                  loading={loadingDeletion}
                  colorScheme="destructive"
                  variant="text"
                  icon="trash"
                  onClick={() => deleteRegistration(editingRegistration.id)}
                >
                  {formatMessage(m.viewStudentDeleteRegistration)}
                </Button>
              </Box>
            )}
          </Box>
    
          <Box>
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData>
                    {formatMessage(m.viewStudentTableHeaderCol1)}
                  </T.HeadData>
                  <T.HeadData>
                    {formatMessage(m.viewStudentTableHeaderCol2)}
                  </T.HeadData>
                  <T.HeadData>
                    {formatMessage(m.viewStudentTableHeaderCol3)}
                  </T.HeadData>
                  <T.HeadData></T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {student &&
                  studentRegistrations.map((entry: any, key: number) => {
                    const bgr = cn({
                      [`${styles.successBackground}`]:
                        !!newRegId && entry.id === newRegId,
                      [`${styles.editingBackground}`]:
                        !!editingRegistration &&
                        entry.id === editingRegistration.id,
                      [`${styles.transparentBackground}`]:
                        !editingRegistration && !newRegId,
                    })
    
                    return (
                      <T.Row key={key}>
                        <T.Data box={{ className: bgr }}>
                          {format(new Date(entry.registerDate), 'dd.MM.yyyy')}
                        </T.Data>
                        <T.Data box={{ className: bgr }}>
                          {entry.teacherName}
                        </T.Data>
                        <T.Data box={{ className: bgr }}>{entry.lessonTime}</T.Data>
                        <T.Data box={{ className: bgr }}>
                          <Box display={'flex'}>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => {
                                setEditingRegistration(entry)
                                setMinutes(entry.lessonTime)
                                setDate(entry.registerDate)
                              }}
                            >
                              {formatMessage(m.viewStudentEditRegistration)}
                            </Button>
                            {newRegId && entry.id === newRegId && (
                              <Box
                                paddingLeft={3}
                                className={styles.showSuccessIcon}
                              >
                                <Icon icon="checkmarkCircle" color="mint400" />
                              </Box>
                            )}
                          </Box>
                        </T.Data>
                      </T.Row>
                    )
                  })}
              </T.Body>
            </T.Table>
          </Box>
    
          <Box marginY={5}>
            <Button variant="ghost" preTextIcon="arrowBack" onClick={goBack}>
              {formatMessage(m.viewStudentGoBackToOverviewButton)}
            </Button>
          </Box>
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewStudent
