import { gql } from "@apollo/client";

export const SUBMIT_SCREEN = gql`
  mutation FormSystemSubmitScreen($input: FormSystemSubmitScreenInput!) {
    formSystemSubmitScreen(input: $input) 
  }
`