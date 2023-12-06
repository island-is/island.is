import {
  Application,
  ApplicationPagination,
  ApplicationState,
  StaffList,
} from '@island.is/financial-aid/shared/lib'
import { useLazyQuery } from '@apollo/client'
import { ApplicationFilterQuery } from '../../graphql'
import { Filters } from './useFilter'

const useApplicationFilter = (
  statesOnRoute: ApplicationState[],
  setApplications: React.Dispatch<
    React.SetStateAction<Application[] | undefined>
  >,
  setStaffList: React.Dispatch<React.SetStateAction<StaffList[] | undefined>>,
) => {
  const [getApplications] = useLazyQuery<{
    filterApplications: ApplicationPagination
  }>(ApplicationFilterQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const filterTable = async (filters: Filters, currentPage: number) => {
    await getApplications({
      variables: {
        input: {
          defaultStates: statesOnRoute,
          states: filters.applicationState,
          staff: filters.staff,
          page: currentPage,
        },
      },
    })
      .then((res) => {
        setApplications(res?.data?.filterApplications.applications)
        setStaffList(res?.data?.filterApplications.staffList)
      })
      .catch(() => {
        console.log('ERROR')
        // TODO
      })
  }
  // const filter = (page: number, searchFilters: Filters) => {
  //   const { applicationState, staff } = searchFilters
  //   getApplications({
  //     variables: {
  //       input: {
  //         defaultStates: statesOnRoute,
  //         states: applicationState,
  //         staff: staff,
  //         page: page,
  //       },
  //     },
  //   })

  //   // const query = new URLSearchParams()
  //   // query.append('page', page.toString())

  //   // if (applicationState.length > 0) {
  //   //   query.append('state', activeFilters.applicationState.join(','))
  //   // }

  //   // if (staff.length > 0) {
  //   //   query.append('staff', activeFilters.staff.join(','))
  //   // }

  //   // router.push({ search: query.toString() })
  // }

  return {
    filterTable,
  }
}
export default useApplicationFilter
