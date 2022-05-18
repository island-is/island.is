import React, { useCallback, useState, useEffect } from 'react'
import {
  Button,
  Text,
  Box,
  RadioButton,
  Input,
  DatePicker,
  Icon,
  toast,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { minutesOfDriving } from '../../lib/constants'
import format from 'date-fns/format'
import * as styles from '../style.css'
import cn from 'classnames'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQuery, useMutation } from '@apollo/client'
import {
  DrivingLicenseBookStudentOverview,
  DrivingBookLesson,
} from '../../types/schema'
import { ViewSingleStudentQuery } from '../../graphql/queries'
import {
  RegisterDrivingLesson,
  DeleteDrivingLesson,
  EditDrivingLesson,
} from '../../graphql/mutations'
import { Application } from '@island.is/application/core'
import Skeleton from './Skeleton'

interface Props {
  application: Application
  studentNationalId: string
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>
}

const ViewStudent = ({
  application,
  studentNationalId,
  setShowTable,
}: Props) => {
  const { formatMessage } = useLocale()

  const {
    data: studentDataResponse,
    loading: loadingStudentsBook,
    refetch: refetchStudent,
  } = useQuery(ViewSingleStudentQuery, {
    variables: {
      input: {
        nationalId: studentNationalId,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const [registerLesson, { loading: loadingRegistration }] = useMutation(
    RegisterDrivingLesson,
  )
  const [deleteLesson, { loading: loadingDeletion }] = useMutation(
    DeleteDrivingLesson,
  )
  const [editLesson, { loading: loadingEdition }] = useMutation(
    EditDrivingLesson,
  )

  const [minutes, setMinutes] = useState(30)
  const [date, setDate] = useState<string>('')
  const [newRegId, setNewRegId] = useState<undefined | string>(undefined)
  const [editingRegistration, setEditingRegistration] = useState<
    undefined | DrivingBookLesson
  >(undefined)
  const [dateError, setDateError] = useState(false)
  const [student, setStudent] = useState<
    undefined | DrivingLicenseBookStudentOverview
  >(studentDataResponse ? studentDataResponse.drivingLicenseBookStudent : {})

  const userNationalId = (application.externalData.nationalRegistry?.data as {
    nationalId?: string
  })?.nationalId

  const studentRegistrations = student?.book
    ?.teachersAndLessons as Array<DrivingBookLesson>

  useEffect(() => {
    setStudent(
      studentDataResponse ? studentDataResponse.drivingLicenseBookStudent : {},
    )
  }, [studentDataResponse])

  const goBack = useCallback(() => {
    setShowTable(true)
  }, [setShowTable])

  const resetFields = (message?: string) => {
    refetchStudent().then(() => {
      message === 'edit'
        ? toast.success(formatMessage(m.successOnEditLesson))
        : message === 'delete'
        ? toast.success(formatMessage(m.successOnDeleteLesson))
        : toast.success(formatMessage(m.successOnRegisterLesson))

      setEditingRegistration(undefined)
      setDate('')
      setMinutes(30)
    })
  }

  const saveChanges = async () => {
    const res = await registerLesson({
      variables: {
        input: {
          createdOn: date,
          minutes: minutes,
          bookId: student?.book?.id,
          comments: '',
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.errorOnRegisterLesson))
    })

    if (res) {
      setNewRegId(
        res.data.drivingLicenseBookCreatePracticalDrivingLesson.id.toUpperCase(),
      )
      resetFields()
    }
  }

  const editChanges = async () => {
    const res = await editLesson({
      variables: {
        input: {
          id: editingRegistration?.id?.toLowerCase(),
          bookId: student?.book?.id,
          minutes: minutes,
          createdOn: date,
          comments: '',
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.errorOnEditLesson))
    })

    if (
      res &&
      res.data.drivingLicenseBookUpdatePracticalDrivingLesson.success
    ) {
      setNewRegId(editingRegistration?.id?.toUpperCase())
      resetFields('edit')
    }
  }

  const deleteRegistration = async (regId: any) => {
    const res = await deleteLesson({
      variables: {
        input: {
          id: regId,
          bookId: student?.book?.id,
          reason: '',
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.errorOnDeleteLesson))
    })

    if (
      res &&
      res.data.drivingLicenseBookDeletePracticalDrivingLesson.success
    ) {
      resetFields('delete')
    }
  }

  return (
    <GridContainer>
      {student && Object.entries(student).length > 0 ? (
        <>
          <GridRow marginBottom={3}>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">{formatMessage(m.viewStudentName)}</Text>
              <Text variant="default">{student.name}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">{formatMessage(m.viewStudentNationalId)}</Text>
              <Text variant="default">{student.nationalId}</Text>
            </GridColumn>
            <GridColumn span={['12/12', '4/12']} paddingBottom={[3, 0]}>
              <Text variant="h4">
                {formatMessage(m.viewStudentCompleteHours)}
              </Text>
              <Text variant="default">
                {student.book?.totalLessonCount ?? 0}
              </Text>
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5} className={styles.hideRow}>
            <GridColumn span={['12/12', '6/12']}>
              <Text variant="h4">
                {formatMessage(m.viewStudentCompleteSchools)}
              </Text>
              {student.book?.drivingSchoolExams?.map((school, key) => {
                return (
                  <Text key={key} variant="default">
                    {school.schoolTypeName}
                  </Text>
                )
              })}
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Text variant="h4">
                {formatMessage(m.viewStudentExamsComplete)}
              </Text>
              {student.book?.testResults?.map((test, key) => {
                return (
                  <Text key={key} variant="default">
                    {test.testTypeName}
                  </Text>
                )
              })}
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={'12/12'} paddingBottom={2}>
              <Text variant="h4">
                {formatMessage(m.viewStudentRegisterMinutes)}
              </Text>
            </GridColumn>

            {minutesOfDriving.map((item, index) => {
              return (
                <GridColumn
                  key={'radioButton-' + index}
                  span={['6/12', '2/12']}
                  paddingBottom={[3, 0]}
                >
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
                </GridColumn>
              )
            })}
            <GridColumn span={['12/12', '3/12']}>
              <Input
                label={formatMessage(m.viewStudentInputMinutesLabel)}
                type="number"
                name="mínútur"
                value={
                  minutes === 30 ||
                  minutes === 45 ||
                  minutes === 60 ||
                  minutes === 90
                    ? ''
                    : minutes
                }
                placeholder="0"
                onChange={(input) => {
                  setMinutes(Number.parseInt(input.target.value, 10))
                }}
                hasError={minutes > 1000}
                errorMessage={formatMessage(m.errorOnInputMinutes)}
              />
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn
              span={['12/12', '5/12']}
              paddingBottom={[3, 0]}
              paddingTop={[3, 0]}
            >
              <DatePicker
                size="sm"
                hasError={dateError}
                errorMessage={formatMessage(m.errorOnMissingDate)}
                handleChange={(date) => {
                  setDate(format(date, 'yyyy-MM-dd'))
                  setDateError(false)
                }}
                label={formatMessage(m.viewStudentSelectDateLabel)}
                locale="is"
                placeholderText={formatMessage(
                  m.viewStudentSelectDatePlaceholder,
                )}
                required
                selected={date ? new Date(date) : null}
              />
            </GridColumn>
            <GridColumn span={['12/12', '2/12']} paddingBottom={[3, 0]}>
              <Button
                fluid
                loading={
                  loadingRegistration || loadingEdition || loadingStudentsBook
                }
                onClick={() =>
                  date !== ''
                    ? !editingRegistration
                      ? saveChanges()
                      : editChanges()
                    : setDateError(true)
                }
              >
                {!editingRegistration
                  ? formatMessage(m.viewStudentRegisterButton)
                  : formatMessage(m.viewStudentEditButton)}
              </Button>
            </GridColumn>
            <GridColumn>
              {editingRegistration && (
                <Button
                  loading={loadingDeletion || loadingStudentsBook}
                  colorScheme="destructive"
                  variant="text"
                  icon="trash"
                  onClick={() => deleteRegistration(editingRegistration.id)}
                >
                  {formatMessage(m.viewStudentDeleteRegistration)}
                </Button>
              )}
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={'12/12'} paddingBottom={2}>
              <Text variant="h4">
                {formatMessage(m.viewStudentRegistrationTableTitle)}
              </Text>
            </GridColumn>
            <GridColumn span={'12/12'}>
              <T.Table>
                <T.Head>
                  <T.Row>
                    <T.HeadData>
                      {formatMessage(m.viewStudentTableHeaderCol1)}
                    </T.HeadData>
                    <T.HeadData>
                      {formatMessage(m.viewStudentTableHeaderCol2)}
                    </T.HeadData>
                    <T.HeadData box={{ textAlign: 'center' }}>
                      {formatMessage(m.viewStudentTableHeaderCol3)}
                    </T.HeadData>
                    <T.HeadData></T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {student &&
                    studentRegistrations
                      ?.map((entry: any, key: number) => {
                        const bgr = cn({
                          [`${styles.successBackground}`]:
                            !!newRegId &&
                            entry.id === newRegId &&
                            !loadingStudentsBook,
                          [`${styles.editingBackground}`]:
                            !!editingRegistration &&
                            entry.id === editingRegistration.id,
                          [`${styles.transparentBackground}`]:
                            !editingRegistration && !newRegId,
                        })

                        return (
                          <T.Row key={key}>
                            <T.Data box={{ className: bgr }}>
                              {format(
                                new Date(entry.registerDate),
                                'dd.MM.yyyy',
                              )}
                            </T.Data>
                            <T.Data box={{ className: bgr }}>
                              {entry.teacherName}
                            </T.Data>
                            <T.Data
                              box={{ className: bgr, textAlign: 'center' }}
                            >
                              {entry.lessonTime}
                            </T.Data>
                            <T.Data box={{ className: bgr }}>
                              {entry.teacherNationalId === userNationalId && (
                                <Box display={'flex'}>
                                  <Button
                                    variant="text"
                                    size="small"
                                    icon={
                                      editingRegistration &&
                                      editingRegistration.id === entry.id
                                        ? 'close'
                                        : undefined
                                    }
                                    onClick={() => {
                                      setEditingRegistration(
                                        editingRegistration ? undefined : entry,
                                      )
                                      setNewRegId(undefined)
                                      setMinutes(entry.lessonTime)
                                      setDate(entry.registerDate)
                                    }}
                                  >
                                    {formatMessage(
                                      m.viewStudentEditRegistration,
                                    )}
                                  </Button>
                                  {newRegId &&
                                    entry.id === newRegId &&
                                    !loadingStudentsBook && (
                                      <Box
                                        paddingLeft={3}
                                        className={styles.showSuccessIcon}
                                      >
                                        <Icon
                                          icon="checkmarkCircle"
                                          color="mint400"
                                        />
                                      </Box>
                                    )}
                                </Box>
                              )}
                            </T.Data>
                          </T.Row>
                        )
                      })
                      .reverse()}
                </T.Body>
              </T.Table>
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn>
              <Button variant="ghost" preTextIcon="arrowBack" onClick={goBack}>
                {formatMessage(m.viewStudentGoBackToOverviewButton)}
              </Button>
            </GridColumn>
          </GridRow>
        </>
      ) : (
        <Skeleton />
      )}
    </GridContainer>
  )
}

export default ViewStudent
