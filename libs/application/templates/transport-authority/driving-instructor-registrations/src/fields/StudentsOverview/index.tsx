import React, { FC, useState } from 'react'
import { useDebounce } from 'react-use'
import {
  Button,
  Box,
  Input,
  Pagination,
  Stack,
  Text,
  Tabs,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { PAGE_SIZE, pages, paginate } from './pagination'
import ViewStudent from '../ViewStudent/index'
import { FieldBaseProps } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import FindStudentModal from '../FindStudentModal/index'
import { useQuery } from '@apollo/client'
import { InstructorsStudentsQuery } from '../../graphql/queries'
import { DrivingLicenseBookStudentForTeacher as Student } from '@island.is/api/schema'
import { format as formatKennitala } from 'kennitala'
import * as styles from '../style.css'
import { LicenseCategory } from '../../types/enums'
import { getValueViaPath } from '@island.is/application/core'

const StudentsOverview: FC<
  React.PropsWithChildren<FieldBaseProps> & {
    field: { props: { allowBELicense: boolean } }
  }
> = ({ application, field }) => {
  const { allowBELicense } = field.props
  const { formatMessage } = useLocale()

  /* table pagination */
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [currentTab, setCurrentTab] = useState<LicenseCategory>(
    LicenseCategory.B,
  )
  const { data, loading } = useQuery(InstructorsStudentsQuery, {
    variables: {
      licenseCategory: currentTab,
    },
    fetchPolicy: 'no-cache',
  })

  const [pageStudents, setPageStudents] = useState(
    data ? (data.drivingLicenseBookStudentsForTeacher as Array<Student>) : [],
  )

  /* table view */
  const [showStudentOverview, setShowStudentOverview] = useState(true)
  const [studentId, setStudentId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState<Array<Student>>([])

  const teacherRights = getValueViaPath<string[]>(
    application.externalData,
    'getTeacherRights.data.rights',
  )
  const showLicenseCategoryTabs =
    allowBELicense && teacherRights?.includes(LicenseCategory.BE)

  const handlePagination = (page: number, students: Array<Student>) => {
    setPage(page)
    setTotalPages(pages(students?.length))
    setFilteredStudents(students)
    setPageStudents(paginate(students, PAGE_SIZE, page))
  }

  const filter = (searchTerm: string) => {
    if (searchTerm.length) {
      const filteredList = data?.drivingLicenseBookStudentsForTeacher?.filter(
        (student: Student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.nationalId.includes(searchTerm),
      )

      handlePagination(1, filteredList)
    } else {
      handlePagination(1, data?.drivingLicenseBookStudentsForTeacher)
    }
  }

  useDebounce(
    () => {
      filter(searchTerm)
    },
    500,
    [data?.drivingLicenseBookStudentsForTeacher, searchTerm],
  )

  return (
    <Box marginBottom={8}>
      <Text variant="h2" marginBottom={3}>
        {showStudentOverview
          ? formatMessage(m.studentsOverviewTitle)
          : currentTab === LicenseCategory.B
          ? formatMessage(m.viewStudentTitle)
          : formatMessage(m.viewBEStudentTitle)}
      </Text>
      {showStudentOverview && showLicenseCategoryTabs && (
        <Box marginBottom={5}>
          <Tabs
            selected={currentTab}
            onlyRenderSelectedTab={true}
            label={''}
            tabs={[
              {
                id: LicenseCategory.B,
                label: formatMessage(m.studentsOverviewBTab),
                content: null,
              },
              {
                id: LicenseCategory.BE,
                label: formatMessage(m.studentsOverviewBETab),
                content: null,
              },
            ]}
            contentBackground="transparent"
            onChange={(e: LicenseCategory) => setCurrentTab(e)}
          />
        </Box>
      )}
      {showStudentOverview ? (
        <Stack space={5}>
          <Box>
            <Input
              name="searchbar"
              label={formatMessage(m.studentsOverviewSearchLabel)}
              placeholder={formatMessage(m.studentsOverviewSearchPlaceholder)}
              icon={{ name: 'search' }}
              backgroundColor="blue"
              size="sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FindStudentModal
              application={application}
              setShowStudentOverview={setShowStudentOverview}
              setStudentId={setStudentId}
            />
          </Box>
          <T.Table box={{ overflow: 'hidden' }}>
            <T.Head>
              <T.Row>
                <T.HeadData
                  style={styles.tableStyles}
                  text={{ variant: 'eyebrow' }}
                >
                  {formatMessage(m.studentsOverviewTableHeaderCol1)}
                </T.HeadData>
                <T.HeadData
                  style={styles.tableStyles}
                  text={{ variant: 'eyebrow' }}
                >
                  {formatMessage(m.studentsOverviewTableHeaderCol2)}
                </T.HeadData>
                <T.HeadData
                  style={styles.tableStyles}
                  box={{ textAlign: 'center' }}
                  text={{ variant: 'eyebrow' }}
                >
                  {formatMessage(m.studentsOverviewTableHeaderCol3)}
                </T.HeadData>
                <T.HeadData
                  box={{ textAlign: 'center' }}
                  style={styles.tableStyles}
                  text={{ variant: 'eyebrow' }}
                ></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {pageStudents && pageStudents.length ? (
                pageStudents.map((student) => {
                  return (
                    <T.Row key={student.id}>
                      <T.Data style={styles.tableStyles}>{student.name}</T.Data>
                      <T.Data style={styles.tableStyles}>
                        {formatKennitala(student.nationalId)}
                      </T.Data>
                      <T.Data box={{ textAlign: 'center' }}>
                        {student.totalLessonCount % 2 === 0
                          ? student.totalLessonCount
                          : student.totalLessonCount.toFixed(2) ?? 0}
                      </T.Data>
                      <T.Data
                        box={{ textAlign: 'center' }}
                        style={styles.tableStyles}
                      >
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setStudentId(student.nationalId)
                            setShowStudentOverview(false)
                          }}
                        >
                          {formatMessage(m.studentsOverviewRegisterHoursButton)}
                        </Button>
                      </T.Data>
                    </T.Row>
                  )
                })
              ) : loading || (data && !pageStudents) ? (
                <T.Row>
                  <T.Data colSpan={4} style={styles.tableStyles}>
                    <SkeletonLoader
                      height={50}
                      borderRadius="large"
                      repeat={3}
                      space={1}
                    />
                  </T.Data>
                </T.Row>
              ) : (
                <T.Row>
                  <T.Data colSpan={4}>
                    {formatMessage(m.studentsOverviewNoStudentFound)}
                  </T.Data>
                </T.Row>
              )}
            </T.Body>
          </T.Table>
          {pageStudents && pageStudents.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => handlePagination(page, filteredStudents)}
                >
                  {children}
                </Box>
              )}
            />
          )}
        </Stack>
      ) : (
        <ViewStudent
          application={application}
          studentNationalId={studentId}
          setShowStudentOverview={setShowStudentOverview}
          licenseCategory={currentTab}
        />
      )}
    </Box>
  )
}

export default StudentsOverview
