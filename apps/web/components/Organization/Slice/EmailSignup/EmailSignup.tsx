import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FormField } from '@island.is/web/components'
import { EmailSignup as EmailSignupSchema } from '@island.is/web/graphql/schema'
import slugify from '@sindresorhus/slugify'

interface EmailSignupProps {
  slice: EmailSignupSchema
}

const EmailSignup = ({ slice }: EmailSignupProps) => {
  return (
    <Box
      paddingY={[3, 3, 8]}
      paddingX={[3, 3, 3, 3, 15]}
      borderRadius="large"
      background="blue100"
    >
      <form>
        <Stack space={5}>
          <GridRow>
            <GridColumn span={'12/12'}>
              <Text as="h3" variant="h3" color="blue600">
                {slice.title}
              </Text>
              <Text>{slice.description}</Text>
            </GridColumn>
          </GridRow>

          <GridRow>
            {slice.formFields?.map((field) => {
              const slug = slugify(field.title)
              return (
                <FormField
                  key={field.id}
                  field={field}
                  slug={slug}
                  onChange={() => {}}
                  value=""
                />
              )
            })}
          </GridRow>

          <GridRow>
            <Box width="full" display="flex" justifyContent="flexEnd">
              <Button type="submit">
                {slice.configuration['submitButtonText'] || 'Skrá'}
              </Button>
            </Box>
          </GridRow>
        </Stack>
      </form>
    </Box>
  )
}

export default EmailSignup
