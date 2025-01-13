import { useLocale, useLocalizedQuery } from '@island.is/localization'
import { useNavigate, useParams } from 'react-router-dom'

export const ExampleScreen = () => {
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  )
}

type Params = {
  slug: string
}

// const FormsScreen = () => {
//   const { userInfo } = useAuth()
//   const { formatMessage } = useLocale()
//   const navigate = useNavigate()
//   const nationalId = userInfo?.profile?.nationalId

// Get the slug and send it to the backend with the user nationalId to either get a [formGuids] or create a new form
// If the user has no forms, create a new form
// If the user has forms, get the forms and display them

// const { slug } = useParams() as Params

// use the slug to make a query to the backend to get the formGuids

// if (!nationalId) {
//   return
// }

// const {
//   data,
//   loading,
//   error: formsError,
//   refetch
// } = useLocalizedQuery(FORMS_FROM_SLUG, {
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

// const [createFormMutation, { error }] = useMutation(
//   CREATE_FORM,
//   {
//     onCompleted({ createForm }) {
//       if (slug) {
//         navigate(`../${slug}/${createForm.formGuid}`)
//       }
//     }
//   }
// )

// const createForm = () => {
//   // Graphql mutation to create form
// }

// if (data) {
// check whether the data has an array of formGuids
// if it does, display the list of forms
// if it doesn't, create a new form from template and redirect to
//   }
// }

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
