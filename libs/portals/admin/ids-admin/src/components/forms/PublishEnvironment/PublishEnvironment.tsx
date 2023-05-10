import {
  Box,
  Button,
  RadioButton,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/react/components'
import { m } from '../../../lib/messages'
import { Form, useActionData, useNavigate, useParams } from 'react-router-dom'
import { useLocale } from '@island.is/localization'
import { replaceParams, useSubmitting } from '@island.is/react-spa/shared'
import { IDSAdminPaths } from '../../../lib/paths'
import React, { useContext, useEffect } from 'react'
import { ClientContext } from '../../../shared/context/ClientContext'
import { AuthAdminEnvironment } from '@island.is/api/schema'
import { PublisEnvironmentResult } from './PublishEnvironment.action'

export default function PublishEnvironment() {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const params = useParams()
  const { publishData, availableEnvironments, setPublishData } = useContext(
    ClientContext,
  )

  const actionData = useActionData() as PublisEnvironmentResult
  const { isLoading, isSubmitting } = useSubmitting()

  useEffect(() => {
    if (actionData?.globalError && !isLoading && !isSubmitting)
      toast.error(formatMessage(m.errorPublishingEnvironment))
  }, [actionData?.globalError, isSubmitting, isLoading])

  useEffect(() => {
    if (actionData?.data) {
      toast.success(formatMessage(m.successfullySaved))
      cancel()
    }
  }, [actionData])

  const cancel = () => {
    navigate(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClient,
        params: { tenant: params['tenant'], client: params['client'] },
      }),
    )
  }

  const onChange = (env: AuthAdminEnvironment) => {
    setPublishData?.((prev) => ({
      ...prev,
      fromEnvironment: env,
    }))
  }

  // If there is no publishData, we should close the modal since we can't publish
  useEffect(() => {
    if (!publishData?.toEnvironment) {
      cancel()
    }
  }, [publishData?.toEnvironment])

  return (
    <Modal
      id="publish-client"
      isVisible
      title={formatMessage(m.publishEnvironment, {
        environment: publishData?.toEnvironment,
      })}
      label={formatMessage(m.publishEnvironment, {
        environment: publishData?.toEnvironment,
      })}
      onClose={cancel}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Form method="post">
        <Box paddingTop={3}>
          <Text>{formatMessage(m.publishEnvironmentDescription)}</Text>
          <Text paddingTop={4} variant="h4">
            {formatMessage(m.chooseEnvironmentToCopyFrom)}
          </Text>
          <Box
            width="full"
            display="flex"
            flexDirection={['column', 'column', 'row']}
            justifyContent="spaceBetween"
            columnGap={3}
            rowGap={3}
            paddingTop={3}
          >
            {availableEnvironments?.map((env) => (
              <Box key={env} width={'full'}>
                <RadioButton
                  backgroundColor="blue"
                  label={env}
                  id={`publish-environment-${env}`}
                  large
                  name="publish-environment"
                  value={env}
                  checked={publishData?.fromEnvironment === env}
                  onChange={() => {
                    onChange(env as AuthAdminEnvironment)
                  }}
                />
              </Box>
            ))}
          </Box>
          <input
            type="hidden"
            name="sourceEnvironment"
            value={publishData?.fromEnvironment ?? ''}
          />
          <input
            type="hidden"
            name="targetEnvironment"
            value={publishData?.toEnvironment ?? ''}
          />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            paddingTop={7}
          >
            <Button onClick={cancel} variant="ghost">
              {formatMessage(m.cancel)}
            </Button>
            <Button loading={isSubmitting || isLoading} type="submit">
              {formatMessage(m.publish)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
