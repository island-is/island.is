import {
  Box,
  Drawer,
  Icon,
  Pagination,
  Table as T,
  Tag,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import format from 'date-fns/format'
import { useCallback, useState } from 'react'
import { m } from '../../lib/messages'
import { statusMapper } from '../../shared/utils'
import { AdminApplication } from '../../types/applications'
import { ApplicationDetails } from '../ApplicationDetails/ApplicationDetails'

interface Props {
  applications: AdminApplication[]
}

const pageSize = 12

export const ApplicationsTable = ({ applications }: Props) => {
  const [page, setPage] = useState(1)
  const { formatMessage } = useLocale()

  const pagedDocuments = {
    from: (page - 1) * pageSize,
    to: pageSize * page,
    totalPages: Math.ceil(applications.length / pageSize),
  }

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
              const logo = getOrganizationLogoUrl(
                application.institution ?? 'stafraent-island',
                [],
              )
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
                      <Box
                        padding={2}
                        marginRight={2}
                        style={{
                          backgroundImage: `url(${logo})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                      <span>{application.institution}</span>
                    </Box>
                  </T.Data>
                  <T.Data>
                    <Tag disabled variant={tag.variant}>
                      {formatMessage(tag.label)}
                    </Tag>
                  </T.Data>
                  <T.Data>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flexEnd"
                    >
                      <Tooltip text={formatMessage(m.openApplication)}>
                        <Drawer
                          ariaLabel={`test-${index}`}
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
                          <ApplicationDetails application={application} />
                        </Drawer>
                      </Tooltip>
                    </Box>
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
