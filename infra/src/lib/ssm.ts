import { SSM } from 'aws-sdk'
import type {
  GetParameterRequest,
  PutParameterRequest,
} from 'aws-sdk/clients/ssm'

export const createOrUpdateSSMParameter = async (params: {
  ssm: SSM
  name: string
  value: string
}) => {
  const { ssm, name, value } = params
  const ssmParams: PutParameterRequest = {
    Name: name,
    Value: value,
    Overwrite: true,
  }
  await ssm.putParameter(ssmParams).promise()
}

export const getSSMParameter = async (params: { ssm: SSM; name: string }) => {
  const { ssm, name } = params
  const ssmParams: GetParameterRequest = {
    Name: name,
    WithDecryption: true,
  }
  const { Parameter } = await ssm.getParameter(ssmParams).promise()

  if (Parameter) {
    return Parameter.Value
  }
}
