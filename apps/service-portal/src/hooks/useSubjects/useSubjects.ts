import { useStore } from '../../stateProvider'
import { useEffect } from 'react'
import { fetchWithAuth } from '../../utils/http'

const useSubjects = () => {
  const [
    { subjectList, subjectListState, activeSubjectId },
    dispatch,
  ] = useStore()

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

  const setSubject = (nationalId: string) => {
    dispatch({
      type: 'setActiveSubjectId',
      payload: nationalId,
    })
  }

  return {
    activeSubjectId,
    subjectList,
    subjectListState,
    setSubject,
  }
}

export default useSubjects
