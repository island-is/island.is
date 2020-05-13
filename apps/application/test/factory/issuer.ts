import Issuer from '@island.is/application/api/domains/issuers/model'

const data = async (props = {}) => {
  const defaultProps = {ssn: '0000000000'}
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => Issuer.create(await data(props))
