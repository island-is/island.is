import { useMutation } from "@apollo/client"
import { useAuth } from "@island.is/auth/react"
import { useLocale, useLocalizedQuery } from "@island.is/localization"
import { Params, useNavigate, useParams } from "react-router-dom"
import { CREATE_APPLICATION, CREATE_FORM } from "@island.is/form-system/graphql"


export const FormsScreen = () => {
  const { userInfo } = useAuth()
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const nationalId = userInfo?.profile?.nationalId

  // Get the slug and send it to the backend with the user nationalId to either get a [formGuids] or create a new form
  // If the user has no forms, create a new form
  // If the user has forms, get the forms and display them

  const { slug } = useParams() as Params

  // use the slug to make a query to the backend to get the formGuids

  if (!nationalId) {
    return
  }

  // const {
  //   data,
  //   loading,
  //   error: formsError,
  //   refetch
  // } = useLocalizedQuery(CREATE_APPLICATION, {
  //   variables: {
  //     input: {
  //       slug: slug,
  //       nationalId: nationalId
  //     },
  //   },
  //   skip: !slug,
  //   fetchPolicy: 'cache-and-network'
  // })

  // if (loading) {
  //   return <div>Loading...</div>
  // }
  console.log('slug', slug)
  const [createFormMutation, { error }] = useMutation(
    CREATE_APPLICATION,
    // {
    //   onCompleted({ createApplication }) {
    //     if (slug) {
    //       navigate(`../${slug}/${createApplication.formGuid}`)
    //     }
    //   }
    // }
  )
  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)
  const data = async () => {
    try {
      const data = await createFormMutation({
        variables: {
          input: {
            slug: slug
          }
        }
      })
      console.log(data)
    } catch (err) {
      console.error('Error creating form:', err.message)
    }
  }
  data()


  const createForm = () => {
    // Graphql mutation to create form
  }

  // if (data) {
  //   //     check whether the data has an array of formGuids
  //   //     if it does, display the list of forms
  //   //     if it doesn't, create a new form from template and redirect to
  // }

  return <>HOHO</>
}

// const FormCard = () => {
//   // Display form card
//   // Date of last modified
//   // Title of form
//   // Description of form and/or state of form
//   // Display amount of steps completed
//   // Delete button
//   // Open form button

//   return (
//     <FormsScreen />
//   )
// }
