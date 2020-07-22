import React, { FC } from 'react'
import { Box, Typography, Icon, Divider } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { useStore } from 'apps/service-portal/src/stateProvider'

const companyApplications = [
  {
    title: 'Viðspyrna umsókn',
    text: 'Þú hefur ekki klárað umsóknarferlið fyrir viðspyrnu',
  },
]

const userApplications = [
  {
    title: 'Umsókn um ökuskírteini',
    text: 'Þú hefur ekki klárað umsóknarferlið fyrir ökuskirteini',
  },
]

const ApplicationList = () => {
  const [{ userInfo }] = useStore()
  const activeSubjectId = userInfo.sub.nationalId

  const applications =
    activeSubjectId === '5401482231' ? companyApplications : userApplications

  return (
    <>
      {applications.map((application, index) => (
        <Box border="standard" padding={4} key={index}>
          <Box display="flex" alignItems="center" marginBottom={2}>
            <Icon type="info" width={18} />
            <Box marginLeft={2}>
              <Typography variant="h3" as="h3">
                {application.title}
              </Typography>
            </Box>
          </Box>
          <Typography variant="p" as="p" color="dark400">
            {application.text}
          </Typography>
          <Box marginY={3}>
            <Divider weight="alternate" />
          </Box>
        </Box>
      ))}
    </>
  )
}

export default ApplicationList
