import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Input,
  LoadingDots,
  Pagination,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import type {
  ConnectedComponent,
  GetSyslumennDrivingInstructorsQuery,
  GetSyslumennDrivingInstructorsQueryVariables,
} from '@island.is/web/graphql/schema'
import { GET_SYSLUMENN_DRIVING_INSTRUCTORS_QUERY } from '@island.is/web/screens/queries/DrivingInstructors'

import { translation as translationStrings } from './translation.strings'

const DEFAULT_ITEMS_PER_PAGE = 10

type DrivingInstructor =
  GetSyslumennDrivingInstructorsQuery['getSyslumennDrivingInstructors']['list'][number]

const getSortedAndFilteredDrivingInstructors = (
  instructors: DrivingInstructor[],
  searchValue: string,
): DrivingInstructor[] => {
  const searchTerms = searchValue
    .replace('´', '')
    .trim()
    .toLowerCase()
    .split(' ')

  const fullSearchString: string = searchTerms.join(' ')
  const instructorsStartingWithFullSearchString: DrivingInstructor[] = []
  const instructorsContainingAllTerms: DrivingInstructor[] = []

  const startsWithFullSearchString = (
    instructor: DrivingInstructor,
  ): boolean => {
    return (
      instructor.name?.trim().toLowerCase().startsWith(fullSearchString) ||
      instructor.postalCode?.trim().startsWith(fullSearchString) ||
      instructor.municipality?.trim().startsWith(fullSearchString)
    )
  }

  const containsAllTerms = (instructor: DrivingInstructor): boolean => {
    return searchTerms.every((searchTerm) => {
      return (
        instructor.name?.trim().toLowerCase().includes(searchTerm) ||
        instructor.postalCode?.trim().includes(searchTerm) ||
        instructor.municipality?.trim().toLowerCase().includes(searchTerm)
      )
    })
  }

  // Categorize the instructors into two arrays based on the matching criteria
  for (const instructor of instructors) {
    if (startsWithFullSearchString(instructor)) {
      instructorsStartingWithFullSearchString.push(instructor)
    } else if (containsAllTerms(instructor)) {
      instructorsContainingAllTerms.push(instructor)
    }
  }

  // Concatenate the arrays with, starting with the instructors that start with the full search string.
  return instructorsStartingWithFullSearchString.concat(
    instructorsContainingAllTerms,
  )
}

interface DrivingInstructorListProps {
  slice: ConnectedComponent
}

const DrivingInstructorList = ({ slice }: DrivingInstructorListProps) => {
  const [selectedPage, setSelectedPage] = useState(1)
  const { formatMessage } = useIntl()
  const [searchValue, setSearchValue] = useState('')

  const { data, error, loading, called } = useQuery<
    GetSyslumennDrivingInstructorsQuery,
    GetSyslumennDrivingInstructorsQueryVariables
  >(GET_SYSLUMENN_DRIVING_INSTRUCTORS_QUERY)

  const instructorsPerPage =
    slice?.configJson?.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE

  const instructors = data?.getSyslumennDrivingInstructors?.list ?? []

  const filteredInstructors = getSortedAndFilteredDrivingInstructors(
    instructors,
    searchValue,
  )

  const totalInstructorCount = filteredInstructors.length

  return (
    <Box>
      <Box marginBottom={4}>
        <Input
          name="driving-license-input"
          placeholder={formatMessage(translationStrings.searchPlaceholder)}
          backgroundColor={['blue', 'blue', 'white']}
          size="sm"
          icon={{
            name: 'search',
            type: 'outline',
          }}
          value={searchValue}
          onChange={(event) => {
            setSelectedPage(1)
            setSearchValue(event.target.value)
          }}
          loading={loading}
        />
      </Box>

      {called && !loading && error && (
        <AlertMessage
          type="error"
          title={formatMessage(translationStrings.errorOccurredTitle)}
          message={formatMessage(translationStrings.errorOccurredMessage)}
        />
      )}

      {called && !loading && !error && !filteredInstructors?.length && (
        <Box display="flex" justifyContent="center">
          <Text fontWeight="semiBold">
            {formatMessage(translationStrings.noResultsFound)}
          </Text>
        </Box>
      )}

      {!called && loading && (
        <Box display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      )}

      {filteredInstructors?.length > 0 && !error && (
        <Box>
          <T.Table>
            <T.Head>
              <T.HeadData>
                <Text fontWeight="semiBold">
                  {formatMessage(translationStrings.name)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text fontWeight="semiBold">
                  {formatMessage(translationStrings.postalCode)}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text fontWeight="semiBold">
                  {formatMessage(translationStrings.municipality)}
                </Text>
              </T.HeadData>
            </T.Head>
            <T.Body>
              {filteredInstructors
                .slice(
                  (selectedPage - 1) * instructorsPerPage,
                  (selectedPage - 1) * instructorsPerPage + instructorsPerPage,
                )
                .map((instructor) => (
                  <T.Row
                    key={`${instructor.name}-${instructor.postalCode}-${instructor.municipality}`}
                  >
                    <T.Data>{instructor.name}</T.Data>
                    <T.Data>{instructor.postalCode}</T.Data>
                    <T.Data>{instructor.municipality}</T.Data>
                  </T.Row>
                ))}
            </T.Body>
          </T.Table>
          <Box marginTop={3}>
            <Pagination
              page={selectedPage}
              itemsPerPage={instructorsPerPage}
              totalItems={totalInstructorCount}
              renderLink={(page, className, children) => (
                <button
                  onClick={() => {
                    setSelectedPage(page)
                  }}
                >
                  <span className={className}>{children}</span>
                </button>
              )}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DrivingInstructorList
