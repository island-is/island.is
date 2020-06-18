import Issuer from '@island.is/gjafakort/application/domains/issuers/model'

type Properties = {
  ssn?: string
}

const data = async (props: Properties = {}) => {
  const defaultProps = { ssn: '0000000000' }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => Issuer.create(await data(props))
