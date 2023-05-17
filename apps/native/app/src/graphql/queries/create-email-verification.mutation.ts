import {gql} from '@apollo/client';

export const CREATE_EMAIL_VERIFICATION = gql`
  mutation createEmailVerification($input: CreateEmailVerificationInput!) {
    createEmailVerification(input: $input) {
      created
    }
  }
`;
