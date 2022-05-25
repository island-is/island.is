import React from 'react'
import { MailingListSignupSlice as MailingListSignupSliceSchema } from '@island.is/web/graphql/schema'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { Namespace } from '@island.is/api/schema'
import {
  MailingListSignup,
  NameSignupForm,
  GridContainer,
} from '@island.is/web/components'

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
      {slice.variant === 'conference' ? (
        <GridContainer>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <NameSignupForm namespace={namespace} slice={slice} />
            </GridColumn>
          </GridRow>
        </GridContainer>
      ) : (
        <Box paddingBottom={6} marginLeft={[0, 0, 0, 0, 6]}>
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
      )}
    </section>
  )
}
