export const CHECK_TACHO_NET_EXISTS = `
  query TachoNetExistsQuery($input: CheckTachoNetInput!) {
    digitalTachographTachoNetExists(input: $input) {
      exists
    }
  }
`
