import { useStore } from '../../store/stateProvider'
import { useEffect } from 'react'
import { fetchWithAuth } from '../../utils/http'
import { API_USER_ACCOUNTS } from '@island.is/service-portal/constants'

const useSubjects = () => {
  const [{ subjectList, subjectListState }, dispatch] = useStore()

  useEffect(() => {
    async function fetchSubjectList() {
      dispatch({ type: 'fetchSubjectListPending' })

      try {
        const res = await fetchWithAuth(API_USER_ACCOUNTS)
        const data = await res.json()
        dispatch({
          type: 'fetchSubjectListFulfilled',
          payload: data.subjects,
        })
      } catch (err) {
        dispatch({ type: 'fetchSubjectListFailed' })
      }
    }

    fetchSubjectList()
  }, [dispatch])

  return {
    subjectList,
    subjectListState,
  }
}

export default useSubjects
