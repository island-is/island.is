import {
  Box,
  Drawer,
  Icon,
  Pagination,
  Table as T,
  Tag,
  Text,
  toast,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import {
  getBaseUrlForm,
  getLogo,
  getSlugFromType,
  statusMapper,
} from '../../shared/utils'
import { AdminApplication } from '../../types/adminApplication'
import { ApplicationDetails } from '../ApplicationDetails/ApplicationDetails'
import { Organization } from '@island.is/shared/types'
import copyToClipboard from 'copy-to-clipboard'
import * as styles from './ApplicationsTable.css'
import { MouseEvent } from 'react'
import { ApplicationTypes } from '@island.is/application/types'

interface Props {
  applications: AdminApplication[]
  page: number
  setPage: (n: number) => void
  pageSize: number
  organizations: Organization[]
  shouldShowCardButtons?: boolean
  numberOfItems?: number // Set this if using paginated data from api
  showAdminData?: boolean
}

export const ApplicationsTable = ({
  applications,
  page,
  setPage,
  pageSize,
  organizations,
  shouldShowCardButtons = true,
  numberOfItems,
  showAdminData,
}: Props) => {
  const { formatMessage } = useLocale()

  const pagedDocuments = {
    from: numberOfItems ? 0 : (page - 1) * pageSize,
    to: numberOfItems ? numberOfItems : pageSize * page,
    totalPages: numberOfItems
      ? Math.ceil(numberOfItems / pageSize)
      : Math.ceil(applications.length / pageSize),
  }

  const copyApplicationLink = (application: AdminApplication) => {
    const typeId = application.typeId as unknown as ApplicationTypes
    const baseUrl = getBaseUrlForm()
    const slug = getSlugFromType(typeId)
    const copied = copyToClipboard(`${baseUrl}/${slug}/${application.id}`)

    if (copied) {
      toast.success(formatMessage(m.copyLinkSuccessful))
    }
  }

  const handleCopyApplicationLink = (
    e: MouseEvent<HTMLButtonElement>,
    application: AdminApplication,
  ) => {
    // Stop propagation so that the copy button doesn't trigger the drawer opening
    e.stopPropagation()
    copyApplicationLink(application)
  }

  if (applications.length === 0)
    return (
      <Box display="flex" justifyContent="center" marginTop={[3, 3, 6]}>
        <Text variant="h4">{formatMessage(m.notFound)}</Text>
      </Box>
    )

  return (
    <>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>{formatMessage(m.dateCreated)}</T.HeadData>
            {!showAdminData && (
              <T.HeadData>{formatMessage(m.application)}</T.HeadData>
            )}
            <T.HeadData>{formatMessage(m.applicant)}</T.HeadData>
            <T.HeadData>{formatMessage(m.nationalId)}</T.HeadData>
            {showAdminData &&
              applications[0]?.adminData?.map((x) => (
                <T.HeadData key={x.key}>
                  {formatMessage(x.label) ?? ''}
                </T.HeadData>
              ))}
            <T.HeadData>{formatMessage(m.dateModified)}</T.HeadData>
            <T.HeadData>{formatMessage(m.institution)}</T.HeadData>
            <T.HeadData>{formatMessage(m.status)}</T.HeadData>
            <T.HeadData />
          </T.Row>
        </T.Head>
        <T.Body>
          {applications
            .slice(pagedDocuments.from, pagedDocuments.to)
            .map((application, index) => {
              const tag = statusMapper[application.status]
              const logo = getLogo(application.typeId, organizations)
              const cellText = application.pruned ? 'dark300' : 'currentColor'

              return (
                <Drawer
                  key={`${application.id}-${index}`}
                  ariaLabel={`application-drawer-${index}`}
                  baseId={`application-drawer-${index}`}
                  disclosure={
                    <tr
                      role="button"
                      aria-label={formatMessage(m.openApplication)}
                      className={
                        styles.focusableTableRow[
                          application.pruned ? 'pruned' : 'normal'
                        ]
                      }
                    >
                      <T.Data text={{ color: cellText }}>
                        {format(new Date(application.created), 'dd.MM.yyyy')}
                      </T.Data>
                      {!showAdminData && (
                        <T.Data>
                          <Text
                            variant="eyebrow"
                            color={application.pruned ? 'dark300' : 'blue400'}
                          >
                            {application.name}
                          </Text>
                        </T.Data>
                      )}
                      <T.Data text={{ color: cellText }}>
                        {application.applicantName ?? ''}
                      </T.Data>
                      <T.Data text={{ color: cellText }}>
                        {application.applicant}
                      </T.Data>
                      {showAdminData &&
                        application.adminData?.map((x) => (
                          <T.Data key={x.key} text={{ color: cellText }}>
                            {x.values?.join(', ') ?? ''}
                          </T.Data>
                        ))}
                      <T.Data text={{ color: cellText }}>
                        {format(new Date(application.modified), 'dd.MM.yyyy')}
                      </T.Data>
                      <T.Data>
                        <Box display="flex" alignItems="center">
                          <Tooltip text={application.institution}>
                            <img src={logo} alt="" className={styles.logo} />
                          </Tooltip>
                        </Box>
                      </T.Data>
                      <T.Data>
                        <Tag disabled variant={tag.variant} truncate>
                          {formatMessage(tag.label)}
                        </Tag>
                      </T.Data>
                      <T.Data>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="flexEnd"
                        >
                          <Tooltip
                            text={formatMessage(m.copyLinkToApplication)}
                          >
                            <button
                              aria-label={formatMessage(
                                m.copyLinkToApplication,
                              )}
                              onClick={(e) =>
                                handleCopyApplicationLink(e, application)
                              }
                            >
                              <Icon
                                type="outline"
                                color="blue400"
                                icon="copy"
                              />
                            </button>
                          </Tooltip>
                        </Box>
                      </T.Data>
                    </tr>
                  }
                >
                  <ApplicationDetails
                    application={application}
                    onCopyApplicationLink={copyApplicationLink}
                    shouldShowCardButtons={shouldShowCardButtons}
                  />
                </Drawer>
              )
            })}
        </T.Body>
      </T.Table>
      {numberOfItems || applications.length > pageSize ? (
        <Box marginTop={[4, 4, 4, 6]}>
          <Pagination
            page={page}
            totalPages={pagedDocuments.totalPages}
            renderLink={(page, className, children) => (
              <button
                className={className}
                onClick={() => {
                  setPage(page)
                }}
              >
                {children}
              </button>
            )}
          />
        </Box>
      ) : null}
    </>
  )
}
