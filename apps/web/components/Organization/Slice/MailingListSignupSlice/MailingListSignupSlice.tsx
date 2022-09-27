import React from 'react'
import { MailingListSignupSlice as MailingListSignupSliceSchema } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import {
  CategorySignupForm,
  MailingListSignup,
  NameSignupForm,
} from '@island.is/web/components'

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
      {slice.variant === 'conference' && (
        <GridContainer>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <NameSignupForm namespace={namespace} slice={slice} />
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {slice.variant === 'categories' && (
        <GridContainer>
          <GridRow>
            <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
              <CategorySignupForm namespace={namespace} slice={slice} />
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
      {slice.variant === 'default' && (
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
      )}
    </section>
  )
}
