import { WrappedLoaderFn } from '@island.is/portals/core'


export const formsLoader: WrappedLoaderFn = ({ client }) => {
  return async ()/*: Promise<FormListResponse>*/ => {
    const { data, error } =
      await client.query<FormSystemGetFormsQuery>({

      })
  }
}
