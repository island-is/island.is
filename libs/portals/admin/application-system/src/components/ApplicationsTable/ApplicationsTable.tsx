import { Box, Icon, Table as T, Tag, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { statusMapper } from '../../shared/utils'
import { AdminApplication } from '../../types/applications'

interface Props {
  applications: AdminApplication[]
}

export const ApplicationsTable = ({ applications }: Props) => {
  const { formatMessage } = useLocale()

  return (
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
        {applications.map((application, index) => {
          const tag = statusMapper[application.status]
          return (
            <T.Row key={`${application.id}-${index}`}>
              <T.Data>
                {format(new Date(application.created), 'dd.MM.yyyy')}
              </T.Data>
              <T.Data>{application.name}</T.Data>
              <T.Data>Guðmundur Rúnar Jónsson</T.Data> {/* TODO */}
              <T.Data>{application.applicant}</T.Data>
              <T.Data>{application.institution ?? 'No institution'}</T.Data>
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
                    <button aria-label={formatMessage(m.openApplication)}>
                      <Icon type="outline" color="blue400" icon="copy" />
                    </button>
                  </Tooltip>
                </Box>
              </T.Data>
            </T.Row>
          )
        })}
      </T.Body>
    </T.Table>
  )
}
