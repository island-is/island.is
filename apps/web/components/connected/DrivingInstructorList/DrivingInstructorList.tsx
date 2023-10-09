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
import {
  ConnectedComponent,
  GetDrivingInstructorsQuery,
  GetDrivingInstructorsQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { GET_DRIVING_INSTRUCTORS_QUERY } from '@island.is/web/screens/queries/DrivingInstructors'
import { useState } from 'react'

const DEFAULT_ITEMS_PER_PAGE = 10

type DrivingInstructor =
  GetDrivingInstructorsQuery['drivingLicenseTeachersV4'][number]

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
  const brokersStartingWithFullSearchString: DrivingInstructor[] = []
  const brokersContainingAllTerm: DrivingInstructor[] = []

  const startsWithFullSearchString = (
    instructor: DrivingInstructor,
  ): boolean => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    return (
      instructor.name?.trim().toLowerCase().startsWith(fullSearchString) ||
      instructor.nationalId?.trim().startsWith(fullSearchString) ||
      (instructor.driverLicenseId &&
        String(instructor.driverLicenseId).startsWith(fullSearchString))
    )
  }

  const containsAllTerms = (instructor: DrivingInstructor): boolean => {
    return searchTerms.every((searchTerm) => {
      return (
        instructor.name?.trim().toLowerCase().includes(searchTerm) ||
        instructor.nationalId?.trim().includes(searchTerm) ||
        (instructor.driverLicenseId &&
          String(instructor.driverLicenseId).includes(searchTerm))
      )
    })
  }

  // Categorize the instructors into two arrays based on the matching criteria
  for (const instructor of instructors) {
    if (startsWithFullSearchString(instructor)) {
      brokersStartingWithFullSearchString.push(instructor)
    } else if (containsAllTerms(instructor)) {
      brokersContainingAllTerm.push(instructor)
    }
  }

  // Concatenate the arrays with, starting with the instructors that start with the full search string.
  return brokersStartingWithFullSearchString.concat(brokersContainingAllTerm)
}

interface DrivingInstructorListProps {
  slice: ConnectedComponent
}

const DrivingInstructorList = ({ slice }: DrivingInstructorListProps) => {
  const [selectedPage, setSelectedPage] = useState(1)
  const n = useNamespace(slice?.json ?? {})
  const [searchValue, setSearchValue] = useState('')

  const { data, error, loading, called } = useQuery<
    GetDrivingInstructorsQuery,
    GetDrivingInstructorsQueryVariables
  >(GET_DRIVING_INSTRUCTORS_QUERY)

  const instructorsPerPage =
    slice?.configJson?.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE

  const instructors = data?.drivingLicenseTeachersV4 ?? []

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
          placeholder={n('searchPlaceholder', 'Leita')}
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
        />
      </Box>

      {called && !loading && error && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja ökukennara')}
        />
      )}

      {called && !loading && !error && !filteredInstructors?.length && (
        <Box display="flex" justifyContent="center">
          <Text fontWeight="semiBold">
            {n('noResultsFound', 'Engir ökukennarar fundust')}
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
                <Text fontWeight="semiBold">{n('name', 'Nafn')}</Text>
              </T.HeadData>
              <T.HeadData>
                <Text fontWeight="semiBold">
                  {n('nationalId', 'Kennitala')}
                </Text>
              </T.HeadData>
              <T.HeadData>
                <Text fontWeight="semiBold">
                  {n('driverLicenseId', 'Ökuréttindisnúmer')}
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
                  <T.Row key={instructor.name}>
                    <T.Data>{instructor.name}</T.Data>
                    <T.Data>{instructor.nationalId}</T.Data>
                    <T.Data>{instructor.driverLicenseId}</T.Data>
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
