import {gql} from '@apollo/client';

export const UPDATE_USER_PROFILE = gql`
  mutation updateProfile($input: UpdateUserProfileInput!) {
    updateProfile(input: $input) {
      nationalId
      mobilePhoneNumber
      locale
      email
    }
  }
`;
