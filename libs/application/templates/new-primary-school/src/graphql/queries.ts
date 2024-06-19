import gql from 'graphql-tag'

export const friggOptionsQuery = gql`
  query FriggOptions($type: EducationFriggOptionsListInput!) {
    friggOptions(input: $type) {
      type
      options {
        id
        key
        value {
          content
          language
        }
      }
    }
  }
`
