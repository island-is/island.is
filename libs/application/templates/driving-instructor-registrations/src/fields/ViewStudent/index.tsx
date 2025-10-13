import React, { useCallback, useState, useEffect } from 'react'
import {
  Button,
  Text,
  Box,
  RadioButton,
  Input,
  DatePicker,
  toast,
  GridContainer,
  GridRow,
  GridColumn,
  AlertMessage,
  Stack,
  Tag,
  Divider,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { minutesOfDriving, minutesSelection } from '../../lib/constants'
import format from 'date-fns/format'
import * as styles from '../style.css'
import cn from 'classnames'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQuery, useMutation } from '@apollo/client'
import {
  DrivingLicenseBookStudentOverview,
  DrivingBookLesson,
  DrivingSchoolExam,
} from '@island.is/api/schema'
import { ViewSingleStudentQuery } from '../../graphql/queries'
import {
  RegisterDrivingLesson,
  DeleteDrivingLesson,
  EditDrivingLesson,
  AllowPracticeDriving,
} from '../../graphql/mutations'
import { Application } from '@island.is/application/types'
import Skeleton from './Skeleton'
import { format as formatNationalId } from 'kennitala'

interface Props {
  application: Application
  studentNationalId: string
  setShowStudentOverview: React.Dispatch<React.SetStateAction<boolean>>
  licenseCategory: 'B' | 'BE'
}

const ViewStudent = ({
  application,
  studentNationalId,
  setShowStudentOverview,
  licenseCategory,
}: Props) => {
  const { formatMessage } = useLocale()
  const {
    data: studentDataResponse,
    loading: loadingStudentsBook,
    error,
    refetch: refetchStudent,
  } = useQuery(ViewSingleStudentQuery, {
    variables: {
      input: {
        nationalId: studentNationalId,
        licenseCategory: licenseCategory,
      },
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  })

  const [registerLesson, { loading: loadingRegistration }] = useMutation(
    RegisterDrivingLesson,
  )
  const [deleteLesson, { loading: loadingDeletion }] =
    useMutation(DeleteDrivingLesson)
  const [editLesson, { loading: loadingEdition }] =
    useMutation(EditDrivingLesson)

  const [allowDriving, { loading: loadingAllow }] =
    useMutation(AllowPracticeDriving)

  const [minutesInputActive, setMinutesInputActive] = useState(false)
  const [minutes, setMinutes] = useState<number>(0)
  const [date, setDate] = useState<string>('')
  const [newRegId, setNewRegId] = useState<undefined | string>(undefined)
  const [editingRegistration, setEditingRegistration] = useState<
    undefined | DrivingBookLesson
  >(undefined)
  const [dateError, setDateError] = useState(false)
  const [student, setStudent] = useState<
    undefined | DrivingLicenseBookStudentOverview
  >(
    studentDataResponse
      ? studentDataResponse.drivingLicenseBookStudentForTeacher
      : {},
  )
  const [completedSchools, setCompletedSchools] = useState<DrivingSchoolExam[]>(
    [],
  )

  const userNationalId = (
    application.externalData.nationalRegistry?.data as {
      nationalId?: string
    }
  )?.nationalId

  const studentRegistrations = student?.book
    ?.teachersAndLessons as Array<DrivingBookLesson>

  const doesStudentBelongToUser =
    userNationalId === student?.book?.teacherNationalId

  useEffect(() => {
    setStudent(
      studentDataResponse
        ? studentDataResponse.drivingLicenseBookStudentForTeacher
        : {},
    )
  }, [studentDataResponse])

  useEffect(() => {
    // Returns most recently confirmed school types
    const schools = [
      ...new Map(
        student?.book?.drivingSchoolExams.map((item: DrivingSchoolExam) => [
          item.schoolTypeName,
          item,
        ]),
      ).values(),
    ]
    setCompletedSchools(schools)
  }, [student])

  const goBack = useCallback(() => {
    setShowStudentOverview(true)
  }, [setShowStudentOverview])

  const resetFields = (message?: string) => {
    refetchStudent().then(() => {
      switch (message) {
        case 'edit':
          toast.success(formatMessage(m.successOnEditLesson))
          break
        case 'delete':
          toast.success(formatMessage(m.successOnDeleteLesson))
          break
        case 'save':
          toast.success(formatMessage(m.successOnRegisterLesson))
          break
        case 'allow':
          toast.success(formatMessage(m.successOnAllowPracticeDriving))
          break
      }
      setEditingRegistration(undefined)
      setDate('')
      setMinutes(0)
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
      setNewRegId(res.data.drivingLicenseBookCreatePracticalDrivingLesson.id)
      resetFields('save')
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
      setNewRegId(editingRegistration?.id)
      resetFields('edit')
    }
  }

  const deleteRegistration = async (regId: string) => {
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

  const allowPracticeDriving = async (studentNationalId: string) => {
    const res = await allowDriving({
      variables: {
        input: {
          nationalId: studentNationalId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.errorOnAllowPracticeDriving))
    })

    if (res && res.data.drivingLicenseBookAllowPracticeDriving.success) {
      resetFields('allow')
    } else {
      toast.error(formatMessage(m.errorOnAllowPracticeDriving))
    }
  }

  const isAllowPracticeDrivingVisible = (
    student: DrivingLicenseBookStudentOverview,
  ): boolean =>
    !student.book.practiceDriving &&
    !!student.book.drivingSchoolExams.find(
      (school) => school.schoolTypeId === 1,
    )

  return (
    <GridContainer>
      {!error &&
      !loadingStudentsBook &&
      student &&
      Object.entries(student).length > 0 ? (
        <Stack space={5}>
          <GridRow>
            {/* Name */}
            <GridColumn span={['12/12', '6/12']} paddingBottom={[5, 0]}>
              <Text variant="h4">{formatMessage(m.viewStudentName)}</Text>
              <Text variant="default">{student.name}</Text>
            </GridColumn>
            {/* NationalId */}
            <GridColumn span={['12/12', '6/12']}>
              <Text variant="h4">{formatMessage(m.viewStudentNationalId)}</Text>
              <Text variant="default">
                {formatNationalId(student.nationalId)}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            {/* Completed hours */}
            <GridColumn span={['12/12', '6/12']}>
              <Text variant="h4">
                {formatMessage(m.viewStudentCompleteHours)}
              </Text>
              <Text variant="default">
                {student.book?.totalLessonCount % 2 === 0
                  ? student.book?.totalLessonCount
                  : student.book?.totalLessonCount.toFixed(2) ?? 0}
              </Text>
            </GridColumn>
          </GridRow>
          {student.book?.practiceDriving ? (
            /* Has permission for practice driving */
            <>
              <GridRow>
                <GridColumn span="12/12">
                  <AlertMessage
                    type="success"
                    title={formatMessage(m.studentMayPracticeAlertTitle)}
                    message={formatMessage(m.studentMayPracticeAlertMessage)}
                  />
                </GridColumn>
              </GridRow>
              <Divider />
            </>
          ) : (
            isAllowPracticeDrivingVisible(student) && (
              <>
                <GridRow>
                  <GridColumn>
                    <Button
                      loading={loadingAllow}
                      onClick={() => allowPracticeDriving(student.nationalId)}
                    >
                      {formatMessage(m.viewStudentPracticeDrivingButton)}
                    </Button>
                  </GridColumn>
                </GridRow>
                <Divider />
              </>
            )
          )}
          {/* Minutes section */}
          <GridRow>
            <GridColumn paddingBottom={2} span="12/12">
              <Text variant="h3">
                {formatMessage(m.viewStudentRegisterDrivingLesson)}
              </Text>
            </GridColumn>
            <GridColumn paddingBottom={2} span="12/12">
              <Text variant="h5">
                {formatMessage(m.viewStudentRegisterMinutes)}
              </Text>
            </GridColumn>

            {minutesOfDriving.map((item, index) => {
              return (
                <GridColumn
                  key={'radioButton-' + index}
                  span={['6/12', '6/12', '6/12', '3/12']}
                  paddingBottom={3}
                >
                  <RadioButton
                    name={'options-' + index}
                    backgroundColor="blue"
                    label={item.label + ' mín'}
                    value={item.value}
                    checked={item.value === minutes && !minutesInputActive}
                    onChange={() => {
                      setMinutes(item.value)
                    }}
                    large
                  />
                </GridColumn>
              )
            })}
            <GridColumn span="12/12">
              <Input
                label={formatMessage(m.viewStudentInputMinutesLabel)}
                type="number"
                name="mínútur"
                backgroundColor="blue"
                value={
                  (minutesSelection.includes(minutes) && !minutesInputActive) ||
                  minutes === 0
                    ? ''
                    : minutes
                }
                onFocus={() => setMinutesInputActive(true)}
                onBlur={() => setMinutesInputActive(false)}
                placeholder="0"
                onChange={(input) => {
                  setMinutes(Number.parseInt(input.target.value, 10))
                }}
                hasError={minutes > 1000}
                errorMessage={formatMessage(m.errorOnInputMinutes)}
              />
            </GridColumn>
          </GridRow>
          {/* Date of the driving lesson */}
          <GridRow marginBottom={3}>
            <GridColumn paddingBottom={3} span="12/12">
              <Text variant="h5" marginBottom={2}>
                {formatMessage(m.viewStudentSelectDateLabel)}
              </Text>
              <DatePicker
                hasError={dateError}
                errorMessage={formatMessage(m.errorOnMissingDate)}
                handleChange={(date) => {
                  setDate(format(date, 'yyyy-MM-dd'))
                  setDateError(false)
                }}
                label={formatMessage(m.viewStudentSelectDateLabel)}
                locale="is"
                backgroundColor="blue"
                placeholderText={formatMessage(
                  m.viewStudentSelectDatePlaceholder,
                )}
                maxDate={new Date()}
                selected={date ? new Date(date) : null}
              />
            </GridColumn>
            <GridColumn>
              <Box display="flex" alignItems="flexEnd" height="full">
                <Button
                  variant="ghost"
                  icon={editingRegistration ? 'checkmark' : undefined}
                  iconType="outline"
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
                  {editingRegistration
                    ? formatMessage(m.saveEditRegistration)
                    : formatMessage(m.saveStudentRegistration)}
                </Button>
              </Box>
            </GridColumn>
            <GridColumn>
              <Box display="flex" alignItems="flexEnd" height="full">
                {editingRegistration && (
                  <Button
                    variant="ghost"
                    icon="trash"
                    iconType="outline"
                    loading={loadingDeletion || loadingStudentsBook}
                    colorScheme="destructive"
                    onClick={() => deleteRegistration(editingRegistration.id)}
                  >
                    {formatMessage(m.viewStudentDeleteRegistration)}
                  </Button>
                )}
              </Box>
            </GridColumn>
          </GridRow>
          {/* Registered hours */}
          <GridRow>
            <GridColumn span="12/12">
              <T.Table box={{ overflow: 'hidden' }}>
                <T.Head>
                  <T.Row>
                    <T.HeadData
                      style={styles.tableStyles}
                      width="25%"
                      text={{ variant: 'eyebrow' }}
                    >
                      {formatMessage(m.viewStudentTableHeaderCol1)}
                    </T.HeadData>
                    <T.HeadData
                      style={styles.tableStyles}
                      width="40%"
                      text={{ variant: 'eyebrow' }}
                    >
                      {formatMessage(m.viewStudentTableHeaderCol2)}
                    </T.HeadData>
                    <T.HeadData
                      style={styles.tableStyles}
                      text={{ variant: 'eyebrow' }}
                    >
                      {formatMessage(m.viewStudentTableHeaderCol3)}
                    </T.HeadData>
                    <T.HeadData
                      style={styles.tableStyles}
                      box={{ textAlign: 'center' }}
                    ></T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {student &&
                    studentRegistrations
                      ?.map((entry: DrivingBookLesson, key: number) => {
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
                          (doesStudentBelongToUser ||
                            entry.teacherNationalId === userNationalId) && (
                            <T.Row key={key}>
                              <T.Data
                                style={styles.tableStyles}
                                box={{ className: bgr }}
                              >
                                {format(
                                  new Date(entry.registerDate),
                                  'dd.MM.yyyy',
                                )}
                              </T.Data>
                              <T.Data
                                style={styles.tableStyles}
                                box={{ className: bgr }}
                              >
                                {entry.teacherName}
                              </T.Data>
                              <T.Data
                                style={styles.tableStyles}
                                box={{
                                  className: bgr,
                                  textAlign: ['center', 'left'],
                                }}
                              >
                                {entry.lessonTime}
                              </T.Data>
                              <T.Data
                                style={styles.tableStyles}
                                box={{ className: bgr, textAlign: 'center' }}
                              >
                                {entry.teacherNationalId === userNationalId && (
                                  <Box display="flex" alignItems="center">
                                    <Button
                                      variant="text"
                                      size="small"
                                      onClick={() => {
                                        setEditingRegistration(
                                          editingRegistration
                                            ? undefined
                                            : entry,
                                        )
                                        setNewRegId(undefined)
                                        setMinutes(
                                          editingRegistration
                                            ? 0
                                            : entry.lessonTime,
                                        )
                                        setDate(
                                          editingRegistration
                                            ? ''
                                            : entry.registerDate,
                                        )
                                      }}
                                    >
                                      {editingRegistration &&
                                      editingRegistration.id === entry.id
                                        ? formatMessage(
                                            m.stopEditingRegistration,
                                          )
                                        : formatMessage(
                                            m.viewStudentEditRegistration,
                                          )}
                                    </Button>
                                  </Box>
                                )}
                              </T.Data>
                            </T.Row>
                          )
                        )
                      })
                      .reverse()}
                </T.Body>
              </T.Table>
            </GridColumn>
          </GridRow>
          {doesStudentBelongToUser && (
            <>
              {licenseCategory !== 'BE' && (
                /* Completed schools */
                <GridRow>
                  <GridColumn span="12/12">
                    <Box
                      display="flex"
                      justifyContent="spaceBetween"
                      alignItems="flexEnd"
                      marginBottom={2}
                    >
                      <Text variant="h3">{formatMessage(m.schoolsTitle)}</Text>
                      <Text fontWeight="regular">
                        {completedSchools.length + ' skráningar'}
                      </Text>
                    </Box>
                    <T.Table box={{ overflow: 'hidden' }}>
                      <T.Head>
                        <T.Row>
                          <T.HeadData
                            style={styles.tableStyles}
                            width="25%"
                            text={{ variant: 'eyebrow' }}
                          >
                            {formatMessage(m.schoolDate)}
                          </T.HeadData>
                          <T.HeadData
                            style={styles.tableStyles}
                            width="40%"
                            text={{ variant: 'eyebrow' }}
                          >
                            {formatMessage(m.school)}
                          </T.HeadData>
                          <T.HeadData
                            style={styles.tableStyles}
                            text={{ variant: 'eyebrow' }}
                          >
                            {formatMessage(m.schoolStatus)}
                          </T.HeadData>
                        </T.Row>
                      </T.Head>
                      <T.Body>
                        {completedSchools.length > 0 &&
                          completedSchools?.map((school, key) => {
                            return (
                              <T.Row key={key}>
                                <T.Data style={styles.tableStyles}>
                                  {format(
                                    new Date(school.examDate),
                                    'dd.MM.yyyy',
                                  )}
                                </T.Data>
                                <T.Data style={styles.tableStyles}>
                                  {school.schoolTypeName}
                                </T.Data>
                                <T.Data style={styles.tableStyles}>
                                  <Tag
                                    variant={
                                      school.statusName ===
                                      formatMessage(m.statusPass)
                                        ? 'mint'
                                        : 'blueberry'
                                    }
                                  >
                                    {school.statusName}
                                  </Tag>
                                </T.Data>
                              </T.Row>
                            )
                          })}
                      </T.Body>
                    </T.Table>
                  </GridColumn>
                </GridRow>
              )}
              {/* Completed exams */}
              <GridRow>
                <GridColumn span="12/12">
                  <Box
                    display="flex"
                    justifyContent="spaceBetween"
                    alignItems="flexEnd"
                    marginBottom={2}
                  >
                    <Text variant="h3">{formatMessage(m.completedTests)}</Text>
                    <Text fontWeight="regular">
                      {student.book?.testResults?.length + ' skráningar'}
                    </Text>
                  </Box>
                  <T.Table box={{ overflow: 'hidden' }}>
                    <T.Head>
                      <T.Row>
                        <T.HeadData
                          style={styles.tableStyles}
                          width="25%"
                          text={{ variant: 'eyebrow' }}
                        >
                          {formatMessage(m.completedTestDate)}
                        </T.HeadData>
                        <T.HeadData
                          style={styles.tableStyles}
                          width="40%"
                          text={{ variant: 'eyebrow' }}
                        >
                          {formatMessage(m.completedTestType)}
                        </T.HeadData>
                        <T.HeadData
                          style={styles.tableStyles}
                          text={{ variant: 'eyebrow' }}
                        >
                          {formatMessage(m.completedTestResult)}
                        </T.HeadData>
                      </T.Row>
                    </T.Head>
                    <T.Body>
                      {student.book?.testResults.length > 0 &&
                        student.book?.testResults.map((test, key) => {
                          return (
                            <T.Row key={key}>
                              <T.Data style={styles.tableStyles}>
                                {format(new Date(test.examDate), 'dd.MM.yyyy')}
                              </T.Data>
                              <T.Data style={styles.tableStyles}>
                                {test.testTypeName}
                              </T.Data>
                              <T.Data style={styles.tableStyles}>
                                <Tag variant={test.hasPassed ? 'mint' : 'rose'}>
                                  {test.hasPassed ? 'Lokið' : 'Fallið'}
                                </Tag>
                              </T.Data>
                            </T.Row>
                          )
                        })}
                    </T.Body>
                  </T.Table>
                </GridColumn>
              </GridRow>
            </>
          )}
          <GridRow>
            <GridColumn>
              <Button variant="ghost" preTextIcon="arrowBack" onClick={goBack}>
                {formatMessage(m.viewStudentGoBackToOverviewButton)}
              </Button>
            </GridColumn>
          </GridRow>
        </Stack>
      ) : error ? (
        <>
          <GridRow marginBottom={8}>
            <GridColumn>
              <AlertMessage
                type="error"
                message={formatMessage(m.errorOnGettingStudentTitle)}
              />
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
