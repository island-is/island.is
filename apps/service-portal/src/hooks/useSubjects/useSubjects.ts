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
        const res = await fetchWithAuth(
          `${API_USER_ACCOUNTS}/${userInfo.user.profile.natreg}`,
          userInfo,
        )
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
  }, [dispatch, userInfo])

  return {
    subjectList,
    subjectListState,
  }
}

export default useSubjects
