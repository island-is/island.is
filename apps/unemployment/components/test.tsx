import React from 'react'
import { Text } from '@island.is/island-ui/core'
import { ApplicationService } from './../services/application.service'

const getApplication = () => {
  ApplicationService.getApplication()
}

const writeApplication = () => {
  ApplicationService.saveApplication(null)
}

const Test = () => {
  return <div><Text>Texti</Text>
  <a onClick={e => getApplication()}>Get Application</a>
  <a onClick={e => writeApplication()}>Write Application</a>
  </div>
}

export default Test
