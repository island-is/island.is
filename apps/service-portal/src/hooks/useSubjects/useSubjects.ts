import { useStore } from '../../store/stateProvider'
import { useEffect } from 'react'
import { fetchWithAuth } from '../../utils/http'
import { API_USER_ACCOUNTS } from '@island.is/service-portal/constants'
import { ActionType } from '../../store/actions'

const useSubjects = () => {
  const [{ subjectList, subjectListState, userInfo }, dispatch] = useStore()

  useEffect(() => {
    async function fetchSubjectList() {
      dispatch({ type: ActionType.FetchSubjectListPending })

      try {
        console.log(userInfo)
        const res = await fetchWithAuth(`${API_USER_ACCOUNTS}/${userInfo.profile.natreg}`, userInfo)
        const data = await res.json()
        dispatch({
          type: ActionType.FetchSubjectListFulfilled,
          payload: data.subjects,
        })
      } catch (err) {
        dispatch({ type: ActionType.FetchSubjectListFailed })
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
