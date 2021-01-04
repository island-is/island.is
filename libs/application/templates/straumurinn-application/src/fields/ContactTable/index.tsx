import React, { FC, useMemo } from 'react'
import { FormItem } from '@island.is/application/core'
import {
  Application,
  formatText,
  RepeaterProps,
} from '@island.is/application/core'
import {
  Box,
  ButtonDeprecated as Button,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Table } from '@island.is/shared/table'

import { m } from '../../forms/messages'
import isEmpty from 'lodash/isEmpty'

interface ContactTableProps {
  application: Application
  dataId: string
  field?: FormItem
  onDeleteContact?: (index: number) => void
}

interface Data {
  name: string
  ssn: string
  email: string
  phone: string
}

const ContactTable: FC<ContactTableProps> = ({
  application,
  onDeleteContact,
  dataId,
  field,
}) => {
  const { formatMessage } = useLocale()
  const isDraft = application.state === 'draft'
  console.log(application.answers?.technicalContact)

  console.log(field && field.id)
  // (
  //   <Box
  //     className={styles.deleteIcon}
  //     onClick={() => onDeleteContact(index)}
  //   >
  //     <Icon
  //       color="dark200"
  //       icon="removeCircle"
  //       size="medium"
  //       type="outline"
  //     />
  //   </Box>
  // ),

  const dataType = field ? field.id : dataId
  const description = isDraft
    ? formatText(
        dataType == 'technicalContact'
          ? m.technicalContactDescription
          : m.businessContactDescription,
        application,
        formatMessage,
      )
    : formatText(
        dataType == 'technicalContact' ? m.technicalContact : m.businessContact,
        application,
        formatMessage,
      )

  const emptyMessage = isDraft
    ? description
    : formatText(m.dataEmpty, application, formatMessage)

  const data =
    dataType == 'technicalContact'
      ? useMemo(
          () =>
            (application as { answers?: { technicalContact?: Data[] } }).answers
              ?.technicalContact ?? [],
          [application.answers?.technicalContact],
        )
      : useMemo(
          () =>
            (application as { answers?: { businessContact?: Data[] } }).answers
              ?.businessContact ?? [],
          [application.answers?.businessContact],
        )

  const columns = React.useMemo(
    () => [
      {
        Header: formatText(m.contactName, application, formatMessage),
        accessor: 'name', // accessor is the "key" in the data
      } as const,
      {
        Header: formatText(m.contactSsn, application, formatMessage),
        accessor: 'ssn',
      } as const,
      {
        Header: formatText(m.contactEmail, application, formatMessage),
        accessor: 'email',
      } as const,
      {
        Header: formatText(m.contactPhone, application, formatMessage),
        accessor: 'phone',
      } as const,
    ],
    [application, formatMessage],
  )

  return !isEmpty(data) ? (
    <Box>
      <Text marginBottom="gutter" marginTop="gutter">
        {description}
      </Text>
      <Table
        columns={columns}
        data={data}
        truncate={false}
        showMoreLabel={formatText(m.showMore, application, formatMessage)}
        showLessLabel={formatText(m.showLess, application, formatMessage)}
      />
    </Box>
  ) : (
    <Text>{emptyMessage}</Text>
  )
}

export default ContactTable
