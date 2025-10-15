import { WrappedLoaderFn } from '@island.is/portals/core'
import {
  FormSystemApplication,
  FormSystemApplicationResponse,
  FormSystemForm,
  FormSystemFormResponse,
  FormSystemOption,
  FormSystemOrganizationAdmin,
  FormSystemOrganizationUrl,
  FormSystemPermissionType,
} from '@island.is/api/schema'
import {
  GET_APPLICATIONS,
  GET_FORMS,
  GET_ORGANIZATION_ADMIN,
  GET_ORGANIZATION_TITLE,
  LoaderResponse,
} from '@island.is/form-system/graphql'
import { removeTypename } from '../../lib/utils/removeTypename'
import { useQuery } from '@apollo/client'
export interface FormsLoaderQueryResponse {
  formSystemForms: FormSystemFormResponse
}
export interface ApplicationsLoaderQueryResponse {
  formSystemApplications?: FormSystemApplicationResponse
}
export interface AdminLoaderQueryResponse {
  formSystemOrganizationAdmin: FormSystemOrganizationAdmin
}

export const formsLoader: WrappedLoaderFn = ({ client, userInfo }) => {
  return async (): Promise<LoaderResponse> => {
    const { data: dataForms, error: errorData } =
      await client.query<FormsLoaderQueryResponse>({
        query: GET_FORMS,
        variables: {
          input: {
            nationalId: userInfo?.profile.nationalId,
          },
        },
        fetchPolicy: 'no-cache',
      })
    if (errorData) {
      throw errorData
    }
    if (!dataForms) {
      throw new Error('No forms were found')
    }
    const { data: dataApplications, error: errorApplications } =
      await client.query<ApplicationsLoaderQueryResponse>({
        query: GET_APPLICATIONS,
        variables: {
          input: {
            organizationNationalId: userInfo?.profile.nationalId,
            page: 1,
            limit: 20,
            isTest: true,
          },
        },
        fetchPolicy: 'no-cache',
      })
    if (errorApplications) {
      throw errorApplications
    }
    if (!dataApplications) {
      throw new Error('No applications were found')
    }
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

    const forms = dataForms.formSystemForms?.forms
      ?.filter((form) => form !== null)
      .map((form) => removeTypename(form)) as FormSystemForm[]

    const organizations = dataForms.formSystemForms?.organizations?.map(
      (org) => ({
        label: org?.label,
        value: org?.value,
        isSelected: org?.isSelected,
      }),
    ) as FormSystemOption[]

    organizations.forEach(async (org) => {
      const { data: titleData } = await client.query({
        query: GET_ORGANIZATION_TITLE,
        variables: { input: { nationalId: org.value } },
        fetchPolicy: 'cache-first',
      })
      org.label = titleData?.formSystemOrganizationTitle || org.value
    })

    const applications = dataApplications.formSystemApplications?.applications
      ?.filter((application) => application !== null)
      .map((application) =>
        removeTypename(application),
      ) as FormSystemApplication[]

    const isAdmin = userInfo?.scopes.includes(
      '@admin.island.is/form-system:admin',
    )

    const organizationNationalId = userInfo?.profile.nationalId
    const admin = data.formSystemOrganizationAdmin
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapPermissionTypes = (types: any[]): FormSystemPermissionType[] =>
      types?.map((type) => ({
        id: type?.id,
        name: type?.name,
        description: type?.description,
        isCommon: type?.isCommon,
      })) as FormSystemPermissionType[]

    const mapOrganizationUrls = (
      urls: FormSystemOrganizationUrl[],
    ): FormSystemOrganizationUrl[] =>
      urls?.map((url) => ({
        id: url?.id,
        url: url?.url,
        type: url?.type,
        method: url?.method,
        isTest: url?.isTest,
      })) as FormSystemOrganizationUrl[]

    return {
      forms: forms,
      organizations: organizations,
      // organizations: mapOrganization(organizations),
      isAdmin,
      organizationNationalId: organizationNationalId,
      applications,
      organizationId: admin?.organizationId as string,
      selectedCertificationTypes: admin?.selectedCertificationTypes?.map(
        (cert) => cert,
      ) as string[],
      selectedListTypes: admin?.selectedListTypes?.map(
        (list) => list,
      ) as string[],
      selectedFieldTypes: admin?.selectedFieldTypes?.map(
        (field) => field,
      ) as string[],
      certificationTypes: mapPermissionTypes(admin.certificationTypes || []),
      listTypes: mapPermissionTypes(admin.listTypes || []),
      fieldTypes: mapPermissionTypes(admin.fieldTypes || []),
      submitUrls: mapOrganizationUrls(
        (admin.submitUrls || []).filter(
          (url): url is FormSystemOrganizationUrl => url !== null,
        ),
      ),
      validationUrls: mapOrganizationUrls(
        (admin.validationUrls || []).filter(
          (url): url is FormSystemOrganizationUrl => url !== null,
        ),
      ),
    }
  }
}
