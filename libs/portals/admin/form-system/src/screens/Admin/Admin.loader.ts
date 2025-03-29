import {
  FormSystemOrganizationAdmin,
  FormSystemPermissionType,
} from '@island.is/api/schema'
import { WrappedLoaderFn } from '@island.is/portals/core'
import {
  GET_ORGANIZATION_ADMIN,
  LoaderResponse,
} from '@island.is/form-system/graphql'
import { Option } from '@island.is/island-ui/core'

export interface AdminLoaderQueryResponse {
  formSystemOrganizationAdmin: FormSystemOrganizationAdmin
}

export const adminLoader: WrappedLoaderFn = ({ client, userInfo }) => {
  return async (): Promise<LoaderResponse> => {
    const { data, error } = await client.query<AdminLoaderQueryResponse>({
      query: GET_ORGANIZATION_ADMIN,
      variables: {
        input: {
          nationalId: userInfo?.profile.nationalId,
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

    const organizationId = data.formSystemOrganizationAdmin
      ?.organizationId as string

    const organizations = data.formSystemOrganizationAdmin?.organizations?.map(
      (org) => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      }),
    ) as Option<string>[]

    const selectedCertificationTypes =
      data.formSystemOrganizationAdmin?.selectedCertificationTypes?.map(
        (certType) => certType,
      ) as string[]

    const selectedListTypes =
      data.formSystemOrganizationAdmin?.selectedListTypes?.map(
        (listType) => listType,
      ) as string[]

    const selectedFieldTypes =
      data.formSystemOrganizationAdmin?.selectedFieldTypes?.map(
        (fieldType) => fieldType,
      ) as string[]

    const certficationTypes =
      data.formSystemOrganizationAdmin.certificationTypes?.map((certType) => ({
        id: certType?.id,
        name: certType?.name,
        description: certType?.description,
        isCommon: certType?.isCommon,
      })) as FormSystemPermissionType[]

    const listTypes = data.formSystemOrganizationAdmin.listTypes?.map(
      (listType) => ({
        id: listType?.id,
        name: listType?.name,
        description: listType?.description,
        isCommon: listType?.isCommon,
      }),
    ) as FormSystemPermissionType[]

    const fieldTypes = data.formSystemOrganizationAdmin.fieldTypes?.map(
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
