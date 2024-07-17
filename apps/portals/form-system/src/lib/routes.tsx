import { Outlet, RouteObject, useNavigate, useParams } from 'react-router-dom'
import { UserProfileLocale } from '@island.is/shared/components'
import { ExampleScreen, FormCards } from '@island.is/form-system/ui'
import { useAuth } from '@island.is/auth/react'
import { useLocale, useLocalizedQuery } from '@island.is/localization'
import { FORMS_FROM_SLUG } from '@island.is/form-system/graphql'

export const BASE_PATH = '/form'

export const routes: RouteObject[] = [
  {
    element: (
      <>
        <UserProfileLocale />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <ExampleScreen />,
      },
      {
        //
        path: '/:slug',
        // Forms screen where a new form is created if the user has not created a form before, otherwise the user sees a list of formerly created forms with the option to create a new one
      },
      {
        path: '/:slug/:id',
      },
    ],
  },
]

type Params = {
  slug: string
}

const FormsScreen = () => {
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

  const {
    data,
    loading,
    error: formsError,
    refetch,
  } = useLocalizedQuery(FORMS_FROM_SLUG, {
    variables: {
      input: {
        slug: slug,
        nationalId: nationalId,
      },
    },
    skip: !slug,
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <div>Loading...</div>
  }

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

  const createForm = () => {
    // Graphql mutation to create form
  }

  if (data) {
    // check whether the data has an array of formGuids
    // if it does, display the list of forms
    // if it doesn't, create a new form from template and redirect to
  }
}

const FormCard = () => {
  // Display form card
  // Date of last modified
  // Title of form
  // Description of form and/or state of form
  // Display amount of steps completed
  // Delete button
  // Open form button

  return <FormCards />
}
