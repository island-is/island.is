import { gql } from '@apollo/client'
import { SectionFragment } from '../fragments/section'

export const CREATE_SECTION = gql`
  mutation FormSystemCreateSection($input: FormSystemCreateSectionInput!) {
    formSystemCreateSection(input: $input) {
      ...SectionDto
    }
  }
  ${SectionFragment}
`
