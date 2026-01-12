import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button } from '@island.is/island-ui/core'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { InputController } from '@island.is/shared/form-fields'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { emailsMsg } from '../../../lib/messages'
import * as styles from './AddEmail.css'

const createEmailFormSchema = (formatMessage: FormatMessage) => {
  const message = formatMessage({
    id: 'sp.settings:email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  })

  return z.object({
    email: z
      .string({
        required_error: message,
      })
      .email({
        message,
      }),
  })
}

type EmailFormValues = z.infer<ReturnType<typeof createEmailFormSchema>>

type AddEmailProps = {
  onAddEmail(email: string): Promise<void>
  onCancel?(): void
  loading?: boolean
  error?: boolean
}

export const AddEmail = ({
  onAddEmail,
  loading,
  error,
  onCancel,
}: AddEmailProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(createEmailFormSchema(formatMessage)),
    defaultValues: {
      email: '',
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = async ({ email }: EmailFormValues) => {
    if (email) {
      await onAddEmail(email)
      methods.reset({
        email: '',
      })
    }
  }

  useEffect(() => {
    if (error) {
      methods.reset({
        email: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <Box marginBottom={2}>
            <Problem size="small" />
          </Box>
        )}
        <Box
          width="full"
          display="flex"
          alignItems={['flexStart', 'flexStart', 'flexStart', 'flexEnd']}
          flexDirection={['column', 'column', 'column', 'row']}
          columnGap={3}
          rowGap={2}
          className={
            onCancel ? styles.contentContainerLarge : styles.contentContainer
          }
        >
          <Box flexGrow={1} width="full">
            <InputController
              control={control}
              id="email"
              autoFocus
              backgroundColor="blue"
              name="email"
              type="email"
              label={formatMessage(m.email)}
              placeholder="nafn@island.is"
              error={errors?.email?.message}
              size="xs"
            />
          </Box>

          <Box
            className={
              errors?.email?.message
                ? styles.errorEmailButtonContainer
                : styles.defaultEmailButtonContainer
            }
          >
            <Box
              display="flex"
              flexDirection="row"
              columnGap={2}
              alignItems="center"
            >
              <Button
                as="button"
                type="submit"
                icon="add"
                loading={loading}
                variant="text"
                size="small"
                nowrap
              >
                {formatMessage(emailsMsg.registerEmail)}
              </Button>
              {onCancel && (
                <Button
                  icon="close"
                  variant="text"
                  colorScheme="destructive"
                  size="small"
                  nowrap
                  onClick={onCancel}
                >
                  {formatMessage(emailsMsg.cancel)}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}
