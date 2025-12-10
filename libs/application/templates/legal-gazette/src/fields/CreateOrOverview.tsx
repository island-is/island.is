import { useMutation } from '@apollo/client'
import { CREATE_APPLICATION } from '@island.is/application/graphql'
import {
  Application,
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import { Button, Inline, toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useNavigate } from 'react-router-dom'
import { m } from '../lib/messages'

export const CreateOrOverview = () => {
  const navigate = useNavigate()
  const [createApplication, { loading }] = useMutation(CREATE_APPLICATION)
  const { formatMessage } = useLocale()

  const handleCreate = () => {
    createApplication({
      variables: {
        input: {
          typeId: ApplicationTypes.LEGAL_GAZETTE,
        },
      },
      onCompleted: (data) => {
        const application = data.createApplication as Application
        const slug =
          ApplicationConfigurations[ApplicationTypes.LEGAL_GAZETTE].slug
        navigate(`/${slug}/${application.id}`)
      },
      onError: () => {
        toast.error(formatMessage(m.errors.createApplicationError), {
          toastId: 'createError',
        })
      },
    })
  }

  return (
    <Inline space={2} flexWrap="wrap">
      <Button
        onClick={() => {
          const slug =
            ApplicationConfigurations[ApplicationTypes.LEGAL_GAZETTE].slug
          return navigate(`/${slug}`)
        }}
        variant="ghost"
        size="small"
        preTextIcon="arrowBack"
      >
        {formatMessage(m.approved.overview)}
      </Button>
      <Button
        onClick={handleCreate}
        loading={loading}
        size="small"
        icon="document"
      >
        {formatMessage(m.approved.newApplication)}
      </Button>
    </Inline>
  )
}
