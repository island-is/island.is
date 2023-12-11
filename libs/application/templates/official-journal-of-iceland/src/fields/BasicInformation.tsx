import {
  Text,
  Button,
  ModalBase,
  Box,
  RadioButton,
  Input,
} from '@island.is/island-ui/core'

import React, { FC, useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { m } from '../lib/messages'
import { FormWrap } from '../components/FormWrap'
import { FieldBaseProps } from '@island.is/application/types'
import * as styles from './BasicInformation.css'
export type CaseTemplate = {
  applicationId?: string
  department: string
  category: string
  subCategory?: string
  title: string
  template: string
  documentContents: string
  autographType: string
  autographcontents: string
  autographDate?: string
  ministry?: string
  preferedPublicationDate?: string
  fastTrack: boolean
}

type ExternalData = {
  previousTemplates?: {
    data: CaseTemplate[]
  }
}

export const BasicInformation: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
  refetch,
}) => {
  const [visibility, setVisibility] = useState(false)
  const { formatMessage } = useLocale()
  const [selectedPreviousTemplate, setSelectedPreviousTemplate] =
    useState<Record<string, any> | null>(null)
  const externalData = application.externalData as ExternalData
  const oldTemplates = externalData?.previousTemplates?.data
  const [templateFilter, setTemplateFilter] = useState('')
  const filteredTemplates = useMemo(() => {
    if (!oldTemplates) {
      return []
    }
    return oldTemplates.filter((template) =>
      template.title.toLowerCase().includes(templateFilter.toLowerCase()),
    )
  }, [oldTemplates, templateFilter])

  return (
    <>
      <FormWrap
        header={{
          children: (
            <Text variant="h2" as="h1">
              {formatText(
                m.basicInformationFormTitle,
                application,
                formatMessage,
              )}
            </Text>
          ),
          button: (
            <Button
              disabled={oldTemplates?.length === 0}
              variant="utility"
              iconType="outline"
              icon="copy"
              onClick={() => setVisibility(true)}
            >
              {formatText(
                m.copyOlderApplicationTemplate,
                application,
                formatMessage,
              )}
            </Button>
          ),
        }}
      >
        <Text>
          {formatText(m.basicInformationIntro, application, formatMessage)}
        </Text>
      </FormWrap>
      <ModalBase
        baseId="confirmationModal"
        isVisible={visibility}
        className={styles.modalBase}
        onVisibilityChange={(visibility) => setVisibility(visibility)}
      >
        <Box background="white" paddingX={3} paddingY={10} width="full">
          <Box paddingX={10}>
            <Text marginBottom={4} variant="h2">
              {formatText(m.caseForCopying, application, formatMessage)}
            </Text>
            <Box marginBottom={2} display="flex" justifyContent="flexStart">
              <Input
                type="text"
                onChange={(e) => setTemplateFilter(e.target.value)}
                icon={{ name: 'search' }}
                size="xs"
                placeholder={formatText(
                  m.searchPlaceholder,
                  application,
                  formatMessage,
                )}
                name="template-filter"
              />
            </Box>
            <Box marginBottom={6}>
              {filteredTemplates?.map((template, i) => (
                <Box
                  padding={2}
                  key={template.applicationId}
                  borderBottomWidth="standard"
                  borderColor="blue200"
                  borderTopWidth={i === 0 ? 'standard' : undefined}
                >
                  <RadioButton
                    label={template.title}
                    name="copyTemplate"
                    value={template.applicationId}
                    onChange={() => setSelectedPreviousTemplate(template)}
                  />
                </Box>
              ))}
            </Box>
            <Box display="flex" justifyContent="spaceBetween">
              <Button variant="ghost" onClick={() => setVisibility(false)}>
                {formatText(m.cancel, application, formatMessage)}
              </Button>
              <Button onClick={() => setVisibility(false)}>
                {formatText(m.confirm, application, formatMessage)}
              </Button>
            </Box>
          </Box>
        </Box>
      </ModalBase>
    </>
  )
}

export default BasicInformation
