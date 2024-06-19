import gql from 'graphql-tag'

export const GetFriggOptions = gql`
  query GetFriggOptions($type: EducationFriggOptionsListInput!) {
    getFriggOptions(input: $type) {
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
