import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@island.is/island-ui/core'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

import { Problem } from '@island.is/react-spa/shared'
import { InputController } from '@island.is/shared/form-fields'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { mVerify, msg } from '../../../../../../lib/messages'
import { FormButton } from '../FormButton'
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
  onAddEmail(email: string): void
  loading?: boolean
  error?: boolean
}

export const AddEmail = ({ onAddEmail, loading, error }: AddEmailProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(createEmailFormSchema(formatMessage)),
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const onSubmit = ({ email }: EmailFormValues) => {
    if (email) {
      onAddEmail(email)
    }
  }

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
          className={styles.contentContainer}
        >
          <Box flexGrow={1} width="full">
            <InputController
              control={control}
              id="email"
              autoFocus
              name="email"
              required={false}
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
            <FormButton
              submit
              icon="add"
              loading={loading}
              variant="text"
              nowrap
            >
              {formatMessage(msg.registerEmail)}
            </FormButton>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}
