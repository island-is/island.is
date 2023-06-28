import { FormEvent } from 'react'
import { Form } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'

import { AuthAdminEnvironment } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/react/components'
import { useLocale } from '@island.is/localization'

import { m } from '../lib/messages'
import { PublishData } from '../types/publishData'

type PublishPermissionFormProps = {
  description: MessageDescriptor
  isVisible: boolean
  availableEnvironments: AuthAdminEnvironment[]
  publishData: PublishData | null
  error: boolean
  loading: boolean
  onClose(): void
  onSubmit(e: FormEvent<HTMLFormElement>): void
  onChange(env: AuthAdminEnvironment): void
}

export const PublishPermissionForm = ({
  description,
  isVisible,
  onClose,
  availableEnvironments,
  publishData,
  onSubmit,
  error,
  loading,
  onChange,
}: PublishPermissionFormProps) => {
  const { formatMessage } = useLocale()

  return (
    <Modal
      id="publish-permission"
      isVisible={isVisible}
      title={formatMessage(m.publishEnvironment, {
        environment: publishData?.toEnvironment,
      })}
      label={formatMessage(m.publishEnvironment, {
        environment: publishData?.toEnvironment,
      })}
      onClose={onClose}
      closeButtonLabel={formatMessage(m.closeModal)}
    >
      <Form method="post" onSubmit={onSubmit}>
        <Box paddingTop={3}>
          <Text>{formatMessage(description)}</Text>
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
          {error && (
            <Box marginTop={3}>
              <AlertMessage
                type="error"
                message={formatMessage(m.errorDefault)}
              />
            </Box>
          )}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            paddingTop={7}
          >
            <Button onClick={onClose} variant="ghost">
              {formatMessage(m.cancel)}
            </Button>
            <Button loading={loading} type="submit">
              {formatMessage(m.publish)}
            </Button>
          </Box>
        </Box>
      </Form>
    </Modal>
  )
}
