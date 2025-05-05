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
import { msg } from '../../../../../../lib/messages'
import { FormButton } from '../FormButton'
import * as styles from './AddEmail.css'

const createEmailFormSchema = (formatMessage: FormatMessage) =>
  z.object({
    email: z.string().email({
      message: formatMessage({
        id: 'sp.settings:email-wrong-format-message',
        defaultMessage: 'Netfangið er ekki á réttu formi',
      }),
    }),
  })

export type EmailFormValues = z.infer<ReturnType<typeof createEmailFormSchema>>

type AddEmailProps = {
  email: string
  onSubmit(values: EmailFormValues): void
}

export const AddEmail = ({ email, onSubmit }: AddEmailProps) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(createEmailFormSchema(formatMessage)),
    defaultValues: {
      email,
    },
  })
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

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
              defaultValue={email}
            />
          </Box>
          <div
            className={
              errors?.email?.message
                ? styles.errorEmailButtonContainer
                : styles.defaultEmailButtonContainer
            }
          >
            <FormButton submit icon="add">
              {formatMessage(msg.registerEmail)}
            </FormButton>
          </div>
        </Box>
      </form>
    </FormProvider>
  )
}
