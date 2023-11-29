import { useState } from 'react'
import { useQuery } from '@apollo/client/react'

import {
  AlertMessage,
  Box,
  FocusableBox,
  LoadingDots,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { ConnectedComponent, Query } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { GET_ADMINISTRATION_OF_SAFETY_AND_HEALTH_COURSES_QUERY } from './queries'
import { getCurrencyString, parseDateString } from './utils'

const normalizesAndMatch = (value1: string, value2: string) => {
  return value1.toLowerCase().trim() === value2.toLowerCase().trim()
}

interface AdministrationOfOccupationalSafetyAndHealthCoursesProps {
  slice: ConnectedComponent
}

type ListState = 'loading' | 'loaded' | 'error'

const AdministrationOfOccupationalSafetyAndHealthCourses = ({
  slice,
}: AdministrationOfOccupationalSafetyAndHealthCoursesProps) => {
  const n = useNamespace(slice.json ?? {})
  const { format } = useDateUtils()

  const [listState, setListState] = useState<ListState>('loading')
  const [courses, setCourses] = useState<
    Query['administrationOfOccupationalSafetyAndHealthCourses']['courses']
  >([])

  useQuery<Query>(GET_ADMINISTRATION_OF_SAFETY_AND_HEALTH_COURSES_QUERY, {
    onCompleted: (data) => {
      const fetchedCourses = [
        ...(data?.administrationOfOccupationalSafetyAndHealthCourses.courses ??
          []),
      ]
      setCourses(
        fetchedCourses.filter((fetchedCourses) => {
          const category = slice.configJson?.category
          const subCategory = slice.configJson?.subCategory

          if (category && subCategory) {
            return (
              normalizesAndMatch(fetchedCourses.category, category) &&
              normalizesAndMatch(fetchedCourses.subCategory, subCategory)
            )
          }

          if (category) {
            return normalizesAndMatch(fetchedCourses.category, category)
          }

          if (subCategory) {
            return normalizesAndMatch(fetchedCourses.subCategory, subCategory)
          }

          return fetchedCourses
        }),
      )
      setListState('loaded')
    },
    onError: () => {
      setListState('error')
    },
  })

  return (
    <Box>
      {listState === 'loading' && (
        <Box
          display="flex"
          marginTop={4}
          marginBottom={20}
          justifyContent="center"
        >
          <LoadingDots />
        </Box>
      )}
      {listState === 'error' && (
        <AlertMessage
          title={n('errorTitle', 'Villa')}
          message={n('errorMessage', 'Ekki tókst að sækja áfengisleyfi.')}
          type="error"
        />
      )}

      {listState === 'loaded' && courses.length === 0 && (
        <Box display="flex" marginTop={4} justifyContent="center">
          <Text variant="h3">{n('noResults', 'Engin Námskeið fundust.')}</Text>
        </Box>
      )}
      {listState === 'loaded' && courses.length > 0 && (
        <Box>
          <Box paddingTop={[4, 4, 6]} paddingBottom={[4, 5, 10]}>
            {courses.map((course, index) => {
              const dateFormat = 'dd.MMM'

              let dateFrom = format(
                parseDateString(course.dateFrom),
                dateFormat,
              )
              if (dateFrom.endsWith('.')) {
                dateFrom = dateFrom.slice(0, dateFrom.length - 1)
              }

              let dateTo = format(parseDateString(course.dateTo), dateFormat)
              if (dateTo.endsWith('.')) {
                dateTo = dateTo.slice(0, dateTo.length - 1)
              }

              return (
                <FocusableBox
                  key={`course-${index}`}
                  href={course.registrationUrl}
                  borderRadius="large"
                  borderColor="transparent"
                  borderWidth="large"
                  flexDirection="column"
                  color={'blue'}
                  height="full"
                  width="full"
                  marginBottom={4}
                >
                  <Box
                    borderWidth="standard"
                    borderColor="standard"
                    borderRadius="standard"
                    paddingX={4}
                    paddingY={3}
                  >
                    <Box
                      alignItems="flexStart"
                      display="flex"
                      flexDirection={[
                        'columnReverse',
                        'columnReverse',
                        'columnReverse',
                        'columnReverse',
                        'row',
                      ]}
                      justifyContent="spaceBetween"
                      marginBottom={2}
                    >
                      <Text variant="h3" color={'blue400'}>
                        {course.name}
                      </Text>
                      <Box marginBottom={[2, 2, 2, 2]}>
                        <Tag disabled>{course.location}</Tag>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={['column', 'column', 'column', 'row']}
                    >
                      <Box style={{ flex: '0 0 50%' }}>
                        <Text>
                          {n('validPeriodLabel', 'Dagsetning')}:{' '}
                          {dateFrom !== dateTo
                            ? dateFrom + ' - ' + dateTo
                            : dateFrom}
                        </Text>
                        <Text paddingBottom={2}>
                          {n('time', 'Klukkan')}: {course.time}
                        </Text>
                      </Box>

                      <Box paddingLeft={[0, 0, 0, 2]}>
                        <Text>
                          {n('price', 'Verð')}:{' '}
                          {getCurrencyString(course.price || 0)}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </FocusableBox>
              )
            })}
          </Box>
        </Box>
      )}
    </Box>
  )
}
export default AdministrationOfOccupationalSafetyAndHealthCourses
