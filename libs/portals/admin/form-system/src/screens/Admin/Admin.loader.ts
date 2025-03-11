import {
  FormSystemFormCertificationType,
  FormSystemOrganizationAdmin,
  FormSystemPermissionType,
} from '@island.is/api/schema'
import { WrappedLoaderFn } from '@island.is/portals/core'
import { GET_ORGANIZATION_ADMIN } from '@island.is/form-system/graphql'
import { Option } from '@island.is/island-ui/core'

export interface AdminLoaderQueryResponse {
  formSystemGetOrganizationAdmin: FormSystemOrganizationAdmin
}

export interface AdminLoaderResponse {
  organizationId: string
  selectedCertificationTypes: string[]
  selectedListTypes: string[]
  selectedFieldTypes: string[]
  certficationTypes: FormSystemPermissionType[]
  listTypes: FormSystemPermissionType[]
  fieldTypes: FormSystemPermissionType[]
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

    const organizationId = data.formSystemGetOrganizationAdmin
      ?.organizationId as string

    const organizations =
      data.formSystemGetOrganizationAdmin?.organizations?.map((org) => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      })) as Option<string>[]

    const selectedCertificationTypes =
      data.formSystemGetOrganizationAdmin?.selectedCertificationTypes?.map(
        (certType) => certType,
      ) as string[]

    const selectedListTypes =
      data.formSystemGetOrganizationAdmin?.selectedListTypes?.map(
        (listType) => listType,
      ) as string[]

    const selectedFieldTypes =
      data.formSystemGetOrganizationAdmin?.selectedFieldTypes?.map(
        (fieldType) => fieldType,
      ) as string[]

    const certficationTypes =
      data.formSystemGetOrganizationAdmin.certificationTypes?.map(
        (certType) => ({
          id: certType?.id,
          name: certType?.name,
          description: certType?.description,
          isCommon: certType?.isCommon,
        }),
      ) as FormSystemPermissionType[]

    const listTypes = data.formSystemGetOrganizationAdmin.listTypes?.map(
      (listType) => ({
        id: listType?.id,
        name: listType?.name,
        description: listType?.description,
        isCommon: listType?.isCommon,
      }),
    ) as FormSystemPermissionType[]

    const fieldTypes = data.formSystemGetOrganizationAdmin.fieldTypes?.map(
      (fieldType) => ({
        id: fieldType?.id,
        name: fieldType?.name,
        description: fieldType?.description,
        isCommon: fieldType?.isCommon,
      }),
    ) as FormSystemPermissionType[]

    return {
      organizationId,
      selectedCertificationTypes,
      selectedListTypes,
      selectedFieldTypes,
      certficationTypes,
      listTypes,
      fieldTypes,
      organizations,
    }
  }
}
