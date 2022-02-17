import React, { useState, useEffect } from 'react'
import {
  Button,
  Text,
  Box,
  Input,
  Pagination,
  Stack,
} from '@island.is/island-ui/core'
import { Table as T } from '@island.is/island-ui/core'
import { PAGE_SIZE, pages, paginate } from './pagination'
import ViewStudent from '../ViewStudent/index'
import { Application } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import FindStudentModal from '../FindStudentModal/index'
import { useQuery } from '@apollo/client'
import { InstructorsStudentsQuery } from '../../graphql/queries'
import * as styles from '../style.css'

interface Data {
  application: Application
}

interface Student {
  id: string
  name: string
  ssn: string
  totalLessonCount: number
}

const StudentsOverview = ({ application }: Data) => {
  const { formatMessage } = useLocale()

  /* table pagination */
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { data, loading } = useQuery(InstructorsStudentsQuery)

  const [pageStudents, setPageStudents] = useState(
    data
      ? (data.drivingBookStudentListByTeacherSsn.data as Array<Student>)
      : [],
  )

  /* table view */
  const [showTable, setShowTable] = useState(true)
  const [studentId, setStudentId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState<Array<object>>()

  const handlePagination = (page: number, students: Array<object>) => {
    setPage(page)
    setTotalPages(pages(students?.length))
    setFilteredStudents(students)
    setPageStudents(paginate(students, PAGE_SIZE, page))
  }

  const filter = (searchTerm: string) => {
    if (searchTerm.length) {
      const filteredList = data.drivingBookStudentListByTeacherSsn.data?.filter(
        (student: Student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.ssn.includes(searchTerm),
      )

      handlePagination(1, filteredList)
    } else {
      handlePagination(1, data?.drivingBookStudentListByTeacherSsn.data)
    }
  }

  useEffect(() => {
    filter(searchTerm)
  }, [data?.drivingBookStudentListByTeacherSsn?.data, searchTerm])

  return (
    <Box marginBottom={10}>
      {showTable ? (
        <Stack space={5}>
          <Box
            display={['block', 'flex', 'flex']}
            justifyContent={'spaceBetween'}
          >
            <Box width="half" className={styles.mobileWidth}>
              <Input
                name="searchbar"
                placeholder={formatMessage(m.studentsOverviewSearchPlaceholder)}
                icon="search"
                backgroundColor="blue"
                size="sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
            <FindStudentModal
              application={application}
              setShowTable={setShowTable}
              setStudentId={setStudentId}
            />
          </Box>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>
                  {formatMessage(m.studentsOverviewTableHeaderCol1)}
                </T.HeadData>
                <T.HeadData>
                  {formatMessage(m.studentsOverviewTableHeaderCol2)}
                </T.HeadData>
                <T.HeadData box={{ textAlign: 'center' }}>
                  {formatMessage(m.studentsOverviewTableHeaderCol3)}
                </T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {pageStudents && pageStudents.length ? (
                pageStudents.map((student, key) => {
                  return (
                    <T.Row key={key}>
                      <T.Data>{student.name}</T.Data>
                      <T.Data>{student.ssn}</T.Data>
                      <T.Data box={{ textAlign: 'center' }}>
                        {student.totalLessonCount}
                      </T.Data>
                      <T.Data>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setStudentId(student.ssn)
                            setShowTable(false)
                          }}
                        >
                          {formatMessage(m.studentsOverviewRegisterHoursButton)}
                        </Button>
                      </T.Data>
                    </T.Row>
                  )
                }
              )) : (
                <Text marginY={2}>{formatMessage(m.studentsOverviewNoStudentFound)}</Text>
              )}
            </T.Body>
          </T.Table>
          {pageStudents && !!pageStudents.length && 
            <Pagination
              page={page}
              totalPages={totalPages}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() =>
                    handlePagination(page, filteredStudents as any)
                  }
                >
                  {children}
                </Box>
              )}
            />
          }
        </Stack>
      ) : (
        <ViewStudent
          application={application}
          studentSsn={studentId}
          setShowTable={setShowTable}
        />
      )}
    </Box>
  )
}

export default StudentsOverview
