import React from 'react'
import {
  GetNamespaceQuery,
  MailingListSignupSlice as MailingListSignup,
} from '@island.is/web/graphql/schema'
import { Box } from '@island.is/island-ui/core'
import { RenderForm } from '@island.is/web/screens/AboutPage/RenderForm'

interface SliceProps {
  slice: MailingListSignup
  namespace: GetNamespaceQuery['getNamespace']
}

export const MailingListSignupSlice: React.FC<SliceProps> = ({
  slice,
  namespace,
}) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <Box
        marginTop={[4, 4, 6]}
        marginBottom={[4, 3, 4]}
        padding={3}
        borderRadius="large"
        background="blue100"
        border="standard"
      >
        <RenderForm
          namespace={namespace}
          heading={slice.title}
          text={slice.description}
          submitButtonText={slice.buttonText}
          inputLabel={slice.inputLabel}
        />
      </Box>
    </section>
  )
}
