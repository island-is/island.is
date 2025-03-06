import {
  FormSystemFormCertificationType,
  FormSystemOrganizationAdmin,
} from '@island.is/api/schema'
import { WrappedLoaderFn } from '@island.is/portals/core'
import { GET_ORGANIZATION_ADMIN } from '@island.is/form-system/graphql'
import { Option } from '@island.is/island-ui/core'

export interface AdminLoaderQueryResponse {
  formSystemGetOrganizationAdmin: FormSystemOrganizationAdmin
}

export interface AdminLoaderResponse {
  selectedCertificationTypes: string[]
  certficationTypes: FormSystemFormCertificationType[]
  organizations: Option<string>[]
}

export const adminLoader: WrappedLoaderFn = ({ client }) => {
  return async (): Promise<AdminLoaderResponse> => {
    const { data, error } = await client.query<AdminLoaderQueryResponse>({
      query: GET_ORGANIZATION_ADMIN,
      variables: {
        input: {
          nationalId: '0',
        },
      },
      fetchPolicy: 'no-cache',
    })
    if (error) {
      throw error
    }
    if (!data) {
      throw new Error('No organization admin was found')
    }

    console.log(data)

    const selectedCertificationTypes =
      data.formSystemGetOrganizationAdmin?.selectedCertificationTypes?.map(
        (certType) => certType,
      ) as string[]

    const certficationTypes =
      data.formSystemGetOrganizationAdmin.certificationTypes?.map(
        (certType) => ({
          id: certType?.id,
          name: certType?.name,
          description: certType?.description,
          isCommon: certType?.isCommon,
        }),
      ) as FormSystemFormCertificationType[]

    const organizations =
      data.formSystemGetOrganizationAdmin?.organizations?.map((org) => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      })) as Option<string>[]

    return {
      selectedCertificationTypes,
      certficationTypes,
      organizations,
    }
  }
}
