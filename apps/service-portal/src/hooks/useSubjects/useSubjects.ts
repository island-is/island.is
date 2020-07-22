import { useStore } from '../../stateProvider'
import { useEffect } from 'react'
import { fetchWithAuth } from '../../utils/http'

const useSubjects = () => {
  const [{ subjectList, subjectListState }, dispatch] = useStore()

  useEffect(() => {
    async function fetchSubjectList() {
      dispatch({ type: 'fetchSubjectListPending' })

      try {
        const res = await fetchWithAuth('/user/accounts')
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
