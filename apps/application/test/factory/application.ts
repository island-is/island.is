import Application from '@island.is/application/api/domains/applications/model'
import {
  Types,
  States,
} from '@island.is/application/api/domains/applications/consts'

import { issuerFactory } from '.'

const data = async (props: any = {}) => {
  let issuer = props.issuer
  if (!issuer) {
    issuer = await issuerFactory()
  }

  const defaultProps = {
    issuerSSN: issuer.ssn,
    type: Types.GJAFAKORT,
    state: States.PENDING,
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => Application.create(await data(props))
