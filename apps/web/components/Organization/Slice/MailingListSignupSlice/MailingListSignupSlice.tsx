import React from 'react'
import { MailingListSignupSlice as MailingListSignupSliceSchema } from '@island.is/web/graphql/schema'
import { Box } from '@island.is/island-ui/core'
import { Namespace } from '@island.is/api/schema'
import { MailingListSignup } from '@island.is/web/components'

interface SliceProps {
  slice: MailingListSignupSliceSchema
  namespace?: Namespace
}

export const MailingListSignupSlice: React.FC<SliceProps> = ({
  slice,
  namespace,
}) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <Box paddingTop={[8, 8, 12]} paddingBottom={4}>
        <MailingListSignup
          namespace={namespace}
          id={'mailingListSignupForm-' + slice.id}
          title={slice.title}
          description={slice.description}
          inputLabel={slice.inputLabel}
          buttonText={slice.buttonText}
          mailingListUrl={slice.signupUrl}
        />
      </Box>
    </section>
  )
}
