import { gql } from '@apollo/client'

export const FORMS_FROM_SLUG = gql`
  query formsFromSlug($input: FormsFromSlugInput!, $locale: String!) {
    formsFromSlug(input: $input, locale: $locale) {
      listOfGuids
    }
  }
`
