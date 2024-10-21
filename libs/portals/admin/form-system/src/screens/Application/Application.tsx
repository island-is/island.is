import { useAuth } from "@island.is/auth/react"
import { useLocale, useLocalizedQuery } from "@island.is/localization"
import { Params, useNavigate, useParams } from "react-router-dom"
import { CREATE_APPLICATION } from "@island.is/form-system/graphql"
import { useMutation } from "@apollo/client"
import { useEffect } from "react"

export const Application = () => {
  const { userInfo } = useAuth()

  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const nationalId = userInfo?.profile?.nationalId

  const { slug } = useParams() as Params

  if (!nationalId) {
    return
  }

  const [createApplication] = useMutation(CREATE_APPLICATION)

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await createApplication({
          variables: {
            input: {
              slug
            }
          }
        })
        //navigate(`../${slug}/${data?.formGuid}`)
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchApplication()
  }, [])



  return <>HOHO</>
}

export default Application
