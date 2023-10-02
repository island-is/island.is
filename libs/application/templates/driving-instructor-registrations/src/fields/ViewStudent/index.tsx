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
  BulletList,
  Bullet,
  Stack,
  Icon,
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
} from '../../types/schema'
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
}

const ViewStudent = ({
  application,
  studentNationalId,
  setShowStudentOverview,
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
      },
    },
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
      setNewRegId(
        res.data.drivingLicenseBookCreatePracticalDrivingLesson.id.toUpperCase(),
      )
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

  const getExamString = ({
    name,
    examDate,
    status,
  }: {
    name: string
    examDate?: string
    status?: string
  }) =>
    `${name}${
      examDate ? ` - ${format(new Date(examDate), 'dd.MM.yyyy')}` : ''
    }${status ? ` - ${status}` : ''}`

  return (
    <GridContainer>
      {!error &&
      !loadingStudentsBook &&
      student &&
      Object.entries(student).length > 0 ? (
        <Stack space={[0, 5]}>
          <GridRow marginBottom={[2, 0]}>
            {/* Name */}
            <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 0]}>
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

          {doesStudentBelongToUser && (
            <>
              <GridRow>
                {/* Completed hours */}
                <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 0]}>
                  <Text variant="h4">
                    {formatMessage(m.viewStudentCompleteHours)}
                  </Text>
                  <Text variant="default">
                    {student.book?.totalLessonCount % 2 === 0
                      ? student.book?.totalLessonCount
                      : student.book?.totalLessonCount.toFixed(2) ?? 0}
                  </Text>
                </GridColumn>
                {/* Has permission for practice driving */}
                <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 0]}>
                  <Text variant="h4">
                    {formatMessage(m.viewStudentPracticeDrivingTitle)}
                  </Text>
                  <Text variant="default">
                    {student.book?.practiceDriving
                      ? formatMessage(m.viewStudentYes)
                      : formatMessage(m.viewStudentNo)}
                  </Text>
                </GridColumn>
              </GridRow>
              <GridRow className={styles.hideRow}>
                {/* Completed schools */}
                <GridColumn span={['12/12', '6/12']}>
                  <Text variant="h4">
                    {formatMessage(m.viewStudentCompleteSchools)}
                  </Text>
                  {completedSchools.length > 0 ? (
                    completedSchools?.map((school, key) => {
                      const textStr = getExamString({
                        name: school.schoolTypeName,
                        examDate: school.examDate,
                        status: school.statusName,
                      })
                      return (
                        <BulletList type="ul" color="dark300">
                          <Bullet>
                            <Text key={key} variant="default">
                              {textStr}
                            </Text>
                          </Bullet>
                        </BulletList>
                      )
                    })
                  ) : (
                    <BulletList type="ul" color="dark300">
                      <Bullet>
                        <Text variant="default">
                          {formatMessage(m.viewStudentNoCompleteSchools)}
                        </Text>
                      </Bullet>
                    </BulletList>
                  )}
                </GridColumn>
                {/* Completed exams */}
                <GridColumn span={['12/12', '6/12']}>
                  <Text variant="h4">
                    {formatMessage(m.viewStudentExamsComplete)}
                  </Text>
                  {student.book?.testResults.filter(
                    (result) => result.hasPassed,
                  ).length > 0 ? (
                    student.book?.testResults
                      .filter((result) => result.hasPassed)
                      .map((test, key) => {
                        const textStr = getExamString({
                          name: test.testTypeName,
                          examDate: test.examDate,
                        })
                        return (
                          <BulletList type="ul" color="dark300">
                            <Bullet>
                              <Text key={key} variant="default">
                                {textStr}
                              </Text>
                            </Bullet>
                          </BulletList>
                        )
                      })
                  ) : (
                    <BulletList type="ul" color="dark300">
                      <Bullet>
                        <Text variant="default">
                          {formatMessage(m.viewStudentNoExamsComplete)}
                        </Text>
                      </Bullet>
                    </BulletList>
                  )}
                </GridColumn>
              </GridRow>
              {/* Allow practice driving button */}
              {isAllowPracticeDrivingVisible(student) && (
                <GridRow marginBottom={[7, 3]}>
                  <GridColumn span={['12/12', '4/12']}>
                    <Button
                      fluid
                      size="medium"
                      loading={loadingAllow}
                      onClick={() => allowPracticeDriving(student.nationalId)}
                    >
                      {formatMessage(m.viewStudentPracticeDrivingButton)}
                    </Button>
                  </GridColumn>
                </GridRow>
              )}
            </>
          )}

          {/* Minutes section */}
          <GridRow>
            <GridColumn span={'12/12'} paddingBottom={2}>
              <Text variant="h3">
                {formatMessage(m.viewStudentRegisterDrivingLesson)}
              </Text>
            </GridColumn>
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
                    checked={item.value === minutes && !minutesInputActive}
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
          <GridRow marginBottom={[7, 3]}>
            <GridColumn
              span={['12/12', '5/12']}
              paddingBottom={[3, 0]}
              paddingTop={[3, 0]}
            >
              <Text variant="h4" marginBottom={2}>
                {formatMessage(m.viewStudentSelectDateLabel)}
              </Text>
              <DatePicker
                size="xs"
                hasError={dateError}
                errorMessage={formatMessage(m.errorOnMissingDate)}
                handleChange={(date) => {
                  setDate(format(date, 'yyyy-MM-dd'))
                  setDateError(false)
                }}
                label=""
                locale="is"
                placeholderText={formatMessage(
                  m.viewStudentSelectDatePlaceholder,
                )}
                maxDate={new Date()}
                required
                selected={date ? new Date(date) : null}
              />
            </GridColumn>
            <GridColumn
              span={editingRegistration ? ['6/12', '2/12'] : ['12/12', '2/12']}
            >
              <Box display="flex" alignItems="flexEnd" height="full">
                <Button
                  size="medium"
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
              </Box>
            </GridColumn>
            <GridColumn span={['6/12', '3/12']}>
              <Box display="flex" alignItems="flexEnd" height="full">
                {editingRegistration && (
                  <Button
                    size="medium"
                    loading={loadingDeletion || loadingStudentsBook}
                    colorScheme="destructive"
                    variant="ghost"
                    icon="trash"
                    onClick={() => deleteRegistration(editingRegistration.id)}
                  >
                    {formatMessage(m.viewStudentDeleteRegistration)}
                  </Button>
                )}
              </Box>
            </GridColumn>
          </GridRow>

          <GridRow marginBottom={5}>
            <GridColumn span={'12/12'} paddingBottom={2}>
              <Text variant="h4">
                {formatMessage(m.viewStudentRegistrationTableTitle)}
              </Text>
            </GridColumn>
            <GridColumn span={'12/12'}>
              <T.Table box={{ overflow: 'hidden' }}>
                <T.Head>
                  <T.Row>
                    <T.HeadData style={styles.tableStyles}>
                      {formatMessage(m.viewStudentTableHeaderCol1)}
                    </T.HeadData>
                    <T.HeadData style={styles.tableStyles}>
                      {formatMessage(m.viewStudentTableHeaderCol2)}
                    </T.HeadData>
                    <T.HeadData style={styles.tableStyles}>
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
                                      icon={
                                        editingRegistration &&
                                        editingRegistration.id === entry.id
                                          ? 'close'
                                          : undefined
                                      }
                                      onClick={() => {
                                        setEditingRegistration(
                                          editingRegistration
                                            ? undefined
                                            : entry,
                                        )
                                        setNewRegId(undefined)
                                        setMinutes(entry.lessonTime)
                                        setDate(entry.registerDate)
                                      }}
                                    >
                                      {editingRegistration &&
                                      editingRegistration.id === entry.id
                                        ? ''
                                        : formatMessage(
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
