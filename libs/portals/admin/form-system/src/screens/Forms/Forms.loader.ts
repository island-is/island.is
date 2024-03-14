import { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemGetFormsQuery } from './Forms.generated'


export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async ()/*: Promise<FormListResponse>*/ => {
    const { data, error } =
      await client.query<FormSystemGetFormsQuery>({

      })
  }
}
