import {
  Box,
  Drawer,
  Icon,
  Pagination,
  Table as T,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { getLogo, statusMapper } from '../../shared/utils'
import { AdminApplication } from '../../types/adminApplication'
import { ApplicationDetails } from '../ApplicationDetails/ApplicationDetails'
import { Organization } from '@island.is/shared/types'
import * as styles from './ApplicationsTable.css'

interface Props {
  applications: AdminApplication[]
  page: number
  setPage: (n: number) => void
  pageSize: number
  organizations: Organization[]
}

export const ApplicationsTable = ({
  applications,
  page,
  setPage,
  pageSize,
  organizations,
}: Props) => {
  const { formatMessage } = useLocale()

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(applications.length / pageSize),
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
            <T.HeadData>{formatMessage(m.date)}</T.HeadData>
            <T.HeadData>{formatMessage(m.application)}</T.HeadData>
            <T.HeadData>{formatMessage(m.applicant)}</T.HeadData>
            <T.HeadData>{formatMessage(m.nationalId)}</T.HeadData>
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

              return (
                <T.Row key={`${application.id}-${index}`}>
                  <T.Data>
                    {format(new Date(application.created), 'dd.MM.yyyy')}
                  </T.Data>
                  <T.Data>{application.name}</T.Data>
                  <T.Data>{application.applicantName ?? ''}</T.Data>
                  <T.Data>{application.applicant}</T.Data>
                  <T.Data>
                    <Box display="flex" alignItems="center">
                      <img src={logo} alt="" className={styles.logo} />
                      <span>{application.institution}</span>
                    </Box>
                  </T.Data>
                  <T.Data>
                    <Tag disabled variant={tag.variant}>
                      {formatMessage(tag.label)}
                    </Tag>
                  </T.Data>
                  <T.Data>
                    <Tooltip text={formatMessage(m.openApplication)}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flexEnd"
                      >
                        <Drawer
                          ariaLabel={`application-drawer-${index}`}
                          baseId={`application-drawer-${index}`}
                          disclosure={
                            <button
                              aria-label={formatMessage(m.openApplication)}
                            >
                              <Icon
                                type="outline"
                                color="blue400"
                                icon="copy"
                              />
                            </button>
                          }
                        >
                          <ApplicationDetails
                            application={application}
                            organizations={organizations}
                          />
                        </Drawer>
                      </Box>
                    </Tooltip>
                  </T.Data>
                </T.Row>
              )
            })}
        </T.Body>
      </T.Table>
      {applications.length > pageSize ? (
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
