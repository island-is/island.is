import { useStore } from '../../stateProvider'
import { useEffect } from 'react'
import { fetchWithAuth } from '../../utils/http'
import { useHistory } from 'react-router-dom'
import { setUserToken } from '../../auth/utils'
import jwtDecode from 'jwt-decode'

const useSubjects = () => {
  const history = useHistory()
  const [{ subjectList, subjectListState, userInfo }, dispatch] = useStore()

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

  const setSubject = (subjectNationalId: string) => {
    async function fetchUserInfo() {
      dispatch({
        type: 'setUserPending',
      })
      const updatedInfo = await setUserToken(
        userInfo.actor.nationalId,
        subjectNationalId,
      )
      dispatch({
        type: 'setUser',
        payload: jwtDecode(updatedInfo.token),
      })
    }

    fetchUserInfo()
    history.push('/')
  }

  return {
    subjectList,
    subjectListState,
    setSubject,
  }
}

export default useSubjects
