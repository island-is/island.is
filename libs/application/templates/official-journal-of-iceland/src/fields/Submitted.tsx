import { FormGroup } from '../components/form/FormGroup'
import { OJOIFieldBaseProps } from '../lib/types'
import { Box, Button, LinkV2 } from '@island.is/island-ui/core'
import { CompleteImage } from '../assets/CompleteImage'
import { submitted } from '../lib/messages/submitted'
import { useLocale } from '@island.is/localization'
import { useApplication } from '../hooks/useUpdateApplication'
import { useNavigate } from 'react-router-dom'
import {
  ApplicationConfigurations,
  ApplicationTypes,
} from '@island.is/application/types'
import { useMutation } from '@apollo/client'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import { AnswerOption } from '../lib/constants'
export const Submitted = (props: OJOIFieldBaseProps) => {
  const { formatMessage, locale } = useLocale()

  const navigate = useNavigate()

  const slug =
    ApplicationConfigurations[ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND].slug

  const { createApplication } = useApplication({
    applicationId: props.application.id,
  })

  const [updateApplicationMutation, { loading: updateLoading }] =
    useMutation(UPDATE_APPLICATION)

  const updateNewApplication = (id: string) => {
    updateApplicationMutation({
      variables: {
        locale,
        input: {
          id: id,
          answers: {
            requirements: {
              approveExternalData: AnswerOption.YES,
            },
          },
        },
      },
      onCompleted: () => {
        navigate(`/${slug}/${id}`)
      },
    })
  }

  const path = window.location.origin
  const isLocalhost = path.includes('localhost')
  const href = isLocalhost
    ? `http://localhost:4200/minarsidur/umsoknir#${props.application.id}`
    : `${path}/minarsidur/umsoknir#${props.application.id}`

  return (
    <FormGroup>
      <Box display="flex">
        <CompleteImage />
      </Box>
      <Box display="flex" justifyContent="spaceBetween">
        <Button
          loading={updateLoading}
          onClick={() =>
            createApplication((data) => {
              if (!data) {
                return
              }

              updateNewApplication(data.createApplication.id)
            })
          }
          variant="ghost"
        >
          {formatMessage(submitted.general.newApplication)}
        </Button>
        <LinkV2 href={href}>
          <Button>
            {formatMessage(submitted.general.returnToServicePortal)}
          </Button>
        </LinkV2>
      </Box>
    </FormGroup>
  )
}
