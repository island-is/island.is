import parseAuthToken from './parseAuthToken'

export const getUserFromDecodedJson = ({ token }) => {
  if (token) {
    const decodedJson = parseAuthToken({ token: token })
    return {
      token: token,
      ssn: decodedJson.user_ssn,
      name: decodedJson.full_name,
    }
  }
}
