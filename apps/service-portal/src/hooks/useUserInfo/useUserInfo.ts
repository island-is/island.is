import { useStore } from '../../store/stateProvider'
import { UserManager } from 'oidc-client'


const useUserInfo = () => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()

 /* const setUser = async (
    actorNationalId: string,
    subjectNationalId: string,
  ) => {
    async function fetchUserInfo() {
      dispatch({
        type: 'setUserPending',
      })

      const updatedInfo = await setUserToken()

      dispatch({
        type: 'setUserFulfilled',
        payload: null // jwtDecode(updatedInfo.token),
      })
    }

    return fetchUserInfo()
  }*/

  const fetchUserFromUserManager = async (userManager: UserManager) => {
    //return await userManager.getUser()
    async function fetchUser() {
      dispatch({
        type: 'setUserPending',
      })

      const updatedInfo = await userManager.getUser()
      console.log('UpdatedInfo ',updatedInfo)
      dispatch({
        type: 'setUserFulfilled',
        payload: updatedInfo,
      })

    }

    return fetchUser()
  }

  const logoutUser = () => {
    console.log('logout User')
    dispatch({type: 'setuserLoggedOut'})
  }

  return {
    userInfo,
    userInfoState,
    logoutUser,
   // setUser,
    fetchUserFromUserManager,
  }
}


export default useUserInfo
