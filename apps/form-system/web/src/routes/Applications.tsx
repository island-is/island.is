import { useLazyQuery, useMutation } from '@apollo/client'
import { FormSystemApplication } from '@island.is/api/schema'
import { ApplicationStatus } from '@island.is/form-system/enums'
import {
  CREATE_APPLICATION,
  DELETE_APPLICATION,
  GET_ALL_APPLICATIONS,
} from '@island.is/form-system/graphql'
import { ApplicationList, m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  GridContainer,
  Page,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorShell } from '../components/ErrorShell/ErrorShell'
import { useHeaderInfo } from '../context/HeaderInfoProvider'

interface Params {
  slug?: string
}

export const Applications = () => {
  useNamespaces('form.system')
  const { slug } = useParams() as Params
  const navigate = useNavigate()
  const { lang } = useLocale()
  const { setInfo } = useHeaderInfo()
  const [applications, setApplications] = useState<FormSystemApplication[]>([])
  const [loginAllowed, setLoginAllowed] = useState(true)
  const [hasRequiredDelegation, setHasRequiredDelegation] = useState(true)
  const [isInaccessible, setIsInaccessible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isValidSlug, setIsValidSlug] = useState(true)
  const [createDisabled, setCreateDisabled] = useState(false)
  const [headerApplication, setHeaderApplication] =
    useState<FormSystemApplication | null>()
  const [createApplicationMutation] = useMutation(CREATE_APPLICATION)
  const currentSlug = useRef(slug)
  currentSlug.current = slug

  const { formatMessage } = useIntl()

  const [getApplications] = useLazyQuery(GET_ALL_APPLICATIONS, {
    fetchPolicy: 'no-cache',
  })

  const createApplication = useCallback(
    async (
      requestSlug = slug,
      shouldApplyResponse = () => currentSlug.current === requestSlug,
    ) => {
      setCreateDisabled(true)
      try {
        const app = await createApplicationMutation({
          variables: {
            input: {
              slug: requestSlug,
            },
          },
        })
        if (!shouldApplyResponse()) {
          return null
        }
        setIsInaccessible(
          app.data?.createFormSystemApplication?.isInaccessible === true,
        )
        if (
          app.data?.createFormSystemApplication?.isLoginTypeAllowed === false
        ) {
          setLoginAllowed(false)
        } else if (
          app.data?.createFormSystemApplication?.hasRequiredDelegation === false
        ) {
          setHasRequiredDelegation(false)
        } else if (app.data?.createFormSystemApplication?.application?.id) {
          navigate(
            `../${requestSlug}/${app.data.createFormSystemApplication.application.id}`,
          )
        }
      } catch (error) {
        console.error('Error creating application:', error)
        return null
      } finally {
        if (shouldApplyResponse()) {
          setCreateDisabled(false)
        }
      }
    },
    [createApplicationMutation, slug, navigate],
  )

  const fetchApplications = useCallback(
    async (
      requestSlug = slug,
      shouldApplyResponse = () => currentSlug.current === requestSlug,
    ) => {
      try {
        const app = await getApplications({
          variables: {
            input: {
              slug: requestSlug,
            },
          },
        })
        if (!shouldApplyResponse()) {
          return null
        }
        if (!app.data) {
          setIsValidSlug(false)
          return null
        }
        const dto = app.data?.formSystemGetApplications

        setIsInaccessible(dto?.isInaccessible === true)
        if (dto?.isInaccessible === true) {
          return null
        }
        if (dto?.isLoginTypeAllowed === false) {
          setLoginAllowed(false)
          return null
        }
        if (dto?.hasRequiredDelegation === false) {
          setHasRequiredDelegation(false)
          return null
        }
        return dto
      } catch (error) {
        console.error('Error fetching applications:', error)
        return null
      }
    },
    [getApplications, slug],
  )

  useEffect(() => {
    let cancelled = false
    const requestSlug = slug
    const isCurrentRequest = () =>
      !cancelled && currentSlug.current === requestSlug

    const run = async () => {
      setIsLoading(true)
      setCreateDisabled(false)
      setHeaderApplication(null)
      const responseDto = await fetchApplications(requestSlug, isCurrentRequest)
      if (!isCurrentRequest()) return

      if (!responseDto) {
        setHeaderApplication(null)
        setIsLoading(false)
        return
      }

      const apps: FormSystemApplication[] = responseDto.applications || []
      setHeaderApplication(apps[0])

      if (apps.length > 0) {
        setApplications(
          apps.filter(
            (app) =>
              ![
                ApplicationStatus.COMPLETED,
                ApplicationStatus.REJECTED,
                ApplicationStatus.APPROVED,
              ].includes(app.status as string),
          ),
        )
      } else {
        await createApplication(requestSlug, isCurrentRequest)
        if (!isCurrentRequest()) return
      }

      setIsLoading(false)
    }

    run()

    return () => {
      cancelled = true
    }
  }, [slug, createApplication, fetchApplications])

  useEffect(() => {
    const resetInfo = {
      applicationName: undefined,
      organizationName: undefined,
      isTest: false,
    }
    const nextInfo =
      headerApplication === null
        ? resetInfo
        : {
            applicationName: headerApplication?.formName?.[lang] ?? '',
            organizationName: headerApplication?.organizationName?.[lang] ?? '',
            isTest: headerApplication?.isTest ?? false,
          }

    setInfo(nextInfo)

    return () => {
      setInfo((currentInfo) =>
        currentInfo.applicationName === nextInfo.applicationName &&
        currentInfo.organizationName === nextInfo.organizationName &&
        currentInfo.isTest === nextInfo.isTest
          ? resetInfo
          : currentInfo,
      )
    }
  }, [headerApplication, lang, setInfo])

  const [deleteApplicationMutation] = useMutation(DELETE_APPLICATION)

  const deleteApplication = useCallback(
    async (applicationId: string) => {
      try {
        await deleteApplicationMutation({
          variables: {
            input: applicationId,
          },
        })
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationId),
        )
      } catch (error) {
        console.error('Error deleting application:', error)
      }
    },
    [deleteApplicationMutation],
  )

  if (isLoading) {
    return null
  }

  if (!isValidSlug) {
    return (
      <ErrorShell
        title={formatMessage(m.slugNotFound)}
        subTitle={formatMessage(m.checkUrlPlease)}
        description=""
      />
    )
  }

  if (isInaccessible) {
    return (
      <ErrorShell
        title={formatMessage(m.applicationInaccessibleHeader)}
        subTitle={formatMessage(m.applicationInaccessibleDescription)}
        description=""
      />
    )
  }

  if (!loginAllowed) {
    return (
      <ErrorShell
        title={formatMessage(m.switchLoginToCreateApplication)}
        subTitle={formatMessage(m.applicationDoesNotPermitLogin)}
        description=""
      />
    )
  }

  if (!hasRequiredDelegation) {
    return (
      <ErrorShell
        title={formatMessage(m.delegationRequired)}
        subTitle={formatMessage(m.applicationRequiresDelegation)}
        description=""
      />
    )
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        marginTop={4}
        marginBottom={4}
      >
        <Text variant="h1">{formatMessage(m.yourApplications)}</Text>
        <Button
          variant="primary"
          onClick={() => createApplication()}
          disabled={createDisabled}
        >
          {formatMessage(m.newApplication)}
        </Button>
      </Box>
      <Box marginTop={4}>
        <Page>
          <GridContainer>
            {applications.length > 0 && (
              <ApplicationList
                applications={applications}
                onDelete={deleteApplication}
              />
            )}
          </GridContainer>
        </Page>
      </Box>
    </>
  )
}
