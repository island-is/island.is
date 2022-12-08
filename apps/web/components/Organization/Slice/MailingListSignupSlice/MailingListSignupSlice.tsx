import React from 'react'
import { MailingListSignupSlice as MailingListSignupSliceSchema } from '@island.is/web/graphql/schema'
import { Box } from '@island.is/island-ui/core'
import { MailingListSignup } from '@island.is/web/components'

interface SliceProps {
  slice: MailingListSignupSliceSchema
  namespace?: Record<string, string>
}

export const MailingListSignupSlice: React.FC<SliceProps> = ({
  slice,
  namespace,
}) => {
  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <Box paddingBottom={6} marginLeft={[0, 0, 0, 0, 6]}>
        <MailingListSignup
          namespace={namespace}
          id={'mailingListSignupForm-' + slice.id}
          title={slice.title}
          description={slice.description}
          inputLabel={slice.inputLabel}
          buttonText={slice.buttonText}
          signupID={slice.id}
          image={slice.image}
        />
      </Box>
    </section>
  )
}
