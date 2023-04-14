import {gql} from '@apollo/client';

export const CREATE_SMS_VERIFICATION = gql`
  mutation createSmsVerification($input: CreateSmsVerificationInput!) {
    createSmsVerification(input: $input) {
      created
    }
  }
`;
