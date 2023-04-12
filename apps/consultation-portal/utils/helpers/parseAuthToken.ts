export const parseAuthToken = ({ token }) => {
  if (token) {
    const tokenArray = token.split('.')
    const tokenWithout = tokenArray.slice(1, -1).join()
    const decoded = Buffer.from(tokenWithout, 'base64').toString('utf-8')
    const decodedJson = JSON.parse(decoded)
    return decodedJson
  }
}

export default parseAuthToken
