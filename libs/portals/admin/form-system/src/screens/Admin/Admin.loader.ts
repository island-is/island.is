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

    const {
      organizationId,
      organizations,
      certificationTypes,
      listTypes,
      fieldTypes,
      selectedCertificationTypes,
      selectedListTypes,
      selectedFieldTypes,
    } = data.formSystemOrganizationAdmin

    const mapToOption = (items: any[]) =>
      items?.map((item) => ({
        label: item?.label,
        value: item?.value,
        isSelected: item?.isSelected,
      })) as Option<string>[]

    const mapToPermissionType = (items: any[]) =>
      items?.map((item) => ({
        id: item?.id,
        name: item?.name,
        description: item?.description,
        isCommon: item?.isCommon,
      })) as FormSystemPermissionType[]

    return {
      organizationId: organizationId as string,
      organizations: mapToOption(organizations ?? []),
      selectedCertificationTypes: selectedCertificationTypes as string[],
      selectedListTypes: selectedListTypes as string[],
      selectedFieldTypes: selectedFieldTypes as string[],
      certficationTypes: mapToPermissionType(certificationTypes ?? []),
      listTypes: mapToPermissionType(listTypes ?? []),
      fieldTypes: mapToPermissionType(fieldTypes ?? []),
    }
  }
}
