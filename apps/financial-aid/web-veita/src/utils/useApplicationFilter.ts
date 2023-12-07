import {
  ApplicationPagination,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { useLazyQuery } from '@apollo/client'
import { ApplicationFilterQuery } from '../../graphql'
import { Filters } from './useFilter'
import { NextRouter } from 'next/router'

const useApplicationFilter = (
  router: NextRouter,
  statesOnRoute: ApplicationState[],
  setFilterApplications: React.Dispatch<
    React.SetStateAction<ApplicationPagination | undefined>
  >,
) => {
  const [getApplications, { error, loading }] = useLazyQuery<{
    filterApplications: ApplicationPagination
  }>(ApplicationFilterQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const filterTable = async (filters: Filters, currentPage: number) => {
    const { applicationState, staff } = filters

    const query = new URLSearchParams()
    query.append('page', currentPage.toString())

    if (applicationState.length > 0) {
      query.append('state', applicationState.join(','))
    }

    if (staff.length > 0) {
      query.append('staff', staff.join(','))
    }

    router.push({ search: query.toString() })

    await getApplications({
      variables: {
        input: {
          defaultStates: statesOnRoute,
          states: applicationState,
          staff: staff,
          page: currentPage,
        },
      },
    })
      .then((res) => {
        setFilterApplications(res?.data?.filterApplications)
      })
      .catch(() => {
        console.log('ERROR')
        // TODO
      })
  }

  return {
    filterTable,
    error,
    loading,
  }
}
export default useApplicationFilter
