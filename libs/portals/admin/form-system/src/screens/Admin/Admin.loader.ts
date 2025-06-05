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

    const admin = data.formSystemOrganizationAdmin

    const mapPermissionTypes = (types: any[]): FormSystemPermissionType[] =>
      types?.map(type => ({
        id: type?.id,
        name: type?.name,
        description: type?.description,
        isCommon: type?.isCommon,
      })) as FormSystemPermissionType[]

    return {
      organizationId: admin?.organizationId as string,
      selectedCertificationTypes: admin?.selectedCertificationTypes?.map(cert => cert) as string[],
      selectedListTypes: admin?.selectedListTypes?.map(list => list) as string[],
      selectedFieldTypes: admin?.selectedFieldTypes?.map(field => field) as string[],
      certficationTypes: mapPermissionTypes(admin.certificationTypes || []),
      listTypes: mapPermissionTypes(admin.listTypes || []),
      fieldTypes: mapPermissionTypes(admin.fieldTypes || []),
      organizations: admin?.organizations?.map(org => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      })) as Option<string>[],
    }
  }
}
