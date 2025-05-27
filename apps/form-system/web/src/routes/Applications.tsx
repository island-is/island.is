import { useNavigate, useParams } from "react-router-dom"
import { CREATE_APPLICATION } from "@island.is/form-system/graphql"
import { useMutation } from "@apollo/client"
import { Button } from "@island.is/island-ui/core"


interface Params {
  slug?: string
}

export const Applications = () => {
  const { slug } = useParams() as Params
  const navigate = useNavigate()

  const [createApplicationMutation] = useMutation(
    CREATE_APPLICATION, {
    onCompleted({ createApplication }) {
      if (slug) {
        console.log(createApplication)
      }
    }
  })

  const createApplication = async () => {
    const app = await createApplicationMutation({
      variables: {
        input: {
          slug: slug,
          createApplicationDto: {
            isTest: false
          }
        }
      }
    })
    if (app) {
      navigate(`../${slug}/${app.data.createFormSystemApplication.id}`)
    }

  }
  return (
    <Button onClick={createApplication}>Create</Button>

  )
}