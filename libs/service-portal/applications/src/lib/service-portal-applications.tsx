import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Box, Typography, Divider } from '@island.is/island-ui/core'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'

const Greeting = () => {
  return (
    <>
      <Typography variant="h2">Umsóknir</Typography>
      <Divider />
      <Box marginTop={4} marginBottom={2} padding={2} border="standard">
        <Typography variant="h4">Fæðingarorlof</Typography>
        <Typography variant="p">
          01 júl. 2020 / 08 ágú. 2020 - Samþykkt
        </Typography>
      </Box>
      <Box marginTop={2} marginBottom={2} padding={2} border="focus">
        <Typography variant="h4">Rafrænt ökuskírteini</Typography>
        <Typography variant="p">01 júl. 2020 - Samþykkt</Typography>
      </Box>
      <Box marginTop={2} marginBottom={2} padding={2} border="standard">
        <Typography variant="h4">Umsókn um ökunám</Typography>
        <Typography variant="p">01 júl. 2020 - Samþykkt</Typography>
      </Box>
    </>
  )
}
const OpenApplications = () => <h1>Opnar umsóknir</h1>
const NewApplication = () => <h1>Ný umsókn</h1>
const NotFound = () => <h1>404</h1>

export const ServicePortalApplications: ServicePortalModuleComponent = ({
  userInfo,
}) => {
  return (
    <div>
      <Switch>
        <Route exact path="/umsoknir" component={Greeting} />

        <Route
          exact
          path="/umsoknir/opnar-umsoknir"
          component={OpenApplications}
        />
        <Route exact path="/umsoknir/ny-umsokn" component={NewApplication} />

        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default ServicePortalApplications
