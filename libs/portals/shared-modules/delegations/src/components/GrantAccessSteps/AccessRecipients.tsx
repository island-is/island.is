import { useState } from 'react'
import { FormProvider, useFieldArray, UseFormReturn } from 'react-hook-form'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Problem } from '@island.is/react-spa/shared'

import { m } from '../../lib/messages'

import { IdentityLookup } from '../../components/IdentityLookup/IdentityLookup'

interface FormData {
  identities: Array<{ nationalId: string; name: string }>
}

export const AccessRecipients = ({
  methods,
}: {
  methods: UseFormReturn<FormData>
}) => {
  const { formatMessage } = useLocale()
  const [formError, setFormError] = useState<Error | undefined>()

  const { control } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'identities',
  })

  return (
    <FormProvider {...methods}>
      <Text variant="h4" marginBottom={4}>
        {formatMessage(m.stepOneTitle)}
      </Text>

      <Box display="flex" flexDirection="column" rowGap={4}>
        {fields.map((field, index) => (
          <Box key={field.id} display="flex" columnGap={4}>
            <IdentityLookup
              setFormError={setFormError}
              methods={methods}
              index={index}
            />
            <Box
              display="flex"
              flexShrink={0}
              alignItems="center"
              justifyContent="flexEnd"
              style={{ width: 85 }}
            >
              {index > 0 && (
                <Button
                  variant="text"
                  size="small"
                  icon="trash"
                  iconType="outline"
                  colorScheme="destructive"
                  onClick={() => remove(index)}
                >
                  {formatMessage(m.grantRemovePerson)}
                </Button>
              )}
            </Box>
          </Box>
        ))}
        <Box>
          <Button
            variant="text"
            size="small"
            icon="add"
            onClick={() => append({ nationalId: '', name: '' })}
          >
            {formatMessage(m.grantAddMorePeople)}
          </Button>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" rowGap={5} marginTop={5}>
        {formError && <Problem error={formError} size="small" />}
      </Box>
    </FormProvider>
  )
}
