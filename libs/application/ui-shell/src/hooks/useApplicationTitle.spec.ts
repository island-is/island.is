import { ApplicationUIState } from '../reducer/ReducerTypes'
import {
  buildForm,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { z } from 'zod'
import { getApplicationTitle } from './useApplicationTitle'
import { MessageDescriptor } from 'react-intl'
import { initializeReducer } from '../reducer/ApplicationFormReducer'
import { FormatMessage } from '@island.is/localization'

describe('getApplicationTitle', () => {
  let applicationState: ApplicationUIState
  const locale = 'is'
  const formatMessage = (str: MessageDescriptor | string) => str.toString()

  beforeEach(() => {
    applicationState = initializeReducer({
      screens: [],
      application: {
        id: '12315151515',
        assignees: [],
        typeId: ApplicationTypes.EXAMPLE_COMMON_ACTIONS,
        attachments: {},
        externalData: {},
        answers: {},
        applicant: '123123',
        state: 'draft',
        modified: new Date(),
        created: new Date(),
        status: ApplicationStatus.IN_PROGRESS,
      },
      form: buildForm({
        id: 'form',
        title: 'Test',
        children: [
          buildTextField({
            id: 'onlyField',
            title: 'Only field',
          }),
          buildSection({
            id: 'firstSection',
            title: 'First section',
            children: [
              buildTextField({
                id: 'myField',
                title: 'Section field',
              }),
            ],
          }),
          buildSection({
            id: 'secondSection',
            title: 'Second section',
            children: [
              buildSubSection({
                id: 'subsection',
                title: 'Subsection',
                children: [
                  buildTextField({
                    id: 'myField',
                    title: 'Subsection field',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      historyReason: 'initial',
      activeScreen: 0,
      dataSchema: z.object({}),
      nationalRegistryId: '1111112199',
      sections: [],
    })
  })

  it('should at least return application name', () => {
    const title = getApplicationTitle(
      applicationState,
      locale,
      formatMessage as FormatMessage,
    )

    expect(title).toEqual('Test | Ísland.is')
  })

  it('should include section name when available', () => {
    applicationState.activeScreen = 1
    const title = getApplicationTitle(
      applicationState,
      locale,
      formatMessage as FormatMessage,
    )

    expect(title).toEqual('First section - Test | Ísland.is')
  })

  it('should include sub-section name when available', () => {
    applicationState.activeScreen = 2
    const title = getApplicationTitle(
      applicationState,
      locale,
      formatMessage as FormatMessage,
    )

    expect(title).toEqual('Subsection - Test | Ísland.is')
  })
})
