import { zodResolver } from '@hookform/resolvers/zod'
import { Box } from '@island.is/island-ui/core'
import {
  FormatMessage,
  useLocale,
  useNamespaces,
} from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'

import { InputController } from '@island.is/shared/form-fields'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { mVerify, msg } from '../../../../../../lib/messages'
import { FormButton } from '../FormButton'
import * as styles from './AddEmail.css'
import { useVerifyEmail } from '@island.is/portals/my-pages/graphql'
import { Problem } from '@island.is/react-spa/shared'
import { useEffect } from 'react'

const createEmailFormSchema = (formatMessage: FormatMessage) =>
  z.object({
    email: z.string().email({
      message: formatMessage({
        id: 'sp.settings:email-wrong-format-message',
        defaultMessage: 'Netfangið er ekki á réttu formi',
      }),
    }),
  })

type EmailFormValues = z.infer<ReturnType<typeof createEmailFormSchema>>

type AddEmailProps = {
  onVerifySuccess(): void
}

export const AddEmail = ({ onVerifySuccess }: AddEmailProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { createEmailVerification, data, loading, error } = useVerifyEmail()

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(createEmailFormSchema(formatMessage)),
  })

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = methods

  const onSubmit = ({ email }: EmailFormValues) => {
    if (email) {
      createEmailVerification({ email })
    }
  }

  useEffect(() => {
    if (data?.createEmailVerification?.created) {
      onVerifySuccess()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.createEmailVerification])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          width="full"
          display="flex"
          alignItems="flexEnd"
          columnGap={2}
          className={styles.contentContainer}
        >
          {error && (
            <Problem size="small" title={formatMessage(mVerify.errorOccured)} />
          )}

          <Box flexGrow={1}>
            <InputController
              control={control}
              backgroundColor="blue"
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

          <div
            className={
              errors?.email?.message
                ? styles.errorEmailButtonContainer
                : styles.defaultEmailButtonContainer
            }
          >
            <FormButton submit icon="add" loading={loading}>
              {formatMessage(msg.registerEmail)}
            </FormButton>
          </div>
        </Box>
      </form>
    </FormProvider>
  )
}
