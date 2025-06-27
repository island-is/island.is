import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Divider,
  Box,
  DropdownMenu,
  Button,
  Icon,
} from '@island.is/island-ui/core'
import { Dispatch, SetStateAction, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TranslationTag } from '../../../TranslationTag/TranslationTag'
import { FormSystemPaths } from '../../../../lib/paths'
import { ApplicationTemplateStatus } from '../../../../lib/utils/interfaces'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { FormSystemForm } from '@island.is/api/schema'
import { useMutation } from '@apollo/client'
import { DELETE_FORM } from '@island.is/form-system/graphql'

interface Props {
  id?: string | null
  name?: string
  created?: Date
  lastModified?: Date
  org?: string | null
  state?: number
  options?: string
  isHeader: boolean
  translated?: boolean
  slug?: string
  beenPublished?: boolean
  setFormsState: Dispatch<SetStateAction<FormSystemForm[]>>
}

const PATH = `https://beta.dev01.devland.is/form`

interface ColumnTextProps {
  text: string | number
}

const ColumnText = ({ text }: ColumnTextProps) => (
  <Box width="full" textAlign="left" paddingLeft={1}>
    <Text variant="medium">{text}</Text>
  </Box>
)

export const TableRow = ({
  id,
  name,
  lastModified,
  org,
  state,
  translated,
  setFormsState,
  slug
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { formatMessage, formatDate } = useIntl()
  const deleteForm = useMutation(DELETE_FORM)
  const goToForm = () => {
    navigate(FormSystemPaths.Form.replace(':formId', String(id)), {
      state: {
        id,
      },
    })
  }
  return (
    <Box
      paddingTop={2}
      paddingBottom={1}
      onClick={() => setIsOpen(!isOpen)}
      style={{ cursor: '' }}
    >
      <Row key={id}>
        <Column span="5/12">
          <ColumnText text={name ? name : ''} />
        </Column>
        <Column span="2/12">
          <ColumnText
            text={formatDate(lastModified ? lastModified : new Date(), {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            })}
          />
        </Column>
        <Column span="1/12">
          <Box display="flex">
            <TranslationTag translated={translated ? translated : false} />
          </Box>
        </Column>
        <Column span="2/12">
          <ColumnText text={org ?? ''} />
        </Column>
        <Column span="1/12">
          <ColumnText text={ApplicationTemplateStatus[state ? state : 0]} />
        </Column>
        <Column span="1/12">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box marginRight={1} onClick={goToForm} cursor="pointer">
              <Icon icon="pencil" color="blue400" type="filled" />
            </Box>
            <DropdownMenu
              menuLabel={`${formatMessage(m.actions)} ${name}`}
              disclosure={
                <Button
                  icon="ellipsisVertical"
                  circle
                  colorScheme="negative"
                  title={formatMessage(m.actions)}
                  inline
                  aria-label={`Aðgerðir`}
                />
              }
              items={[
                {
                  title: formatMessage(m.copy),
                },
                {
                  title: formatMessage(m.delete),
                  onClick: () => {
                    deleteForm[0]({
                      variables: {
                        input: {
                          id: id,
                        },
                      },
                    })
                    setFormsState((prevForms) =>
                      prevForms.filter((form) => form.id !== id),
                    )
                  },
                },
                {
                  title: 'Json',
                },
                {
                  title: 'Skoða',
                  onClick: () => {
                    if (slug) {
                      window.open(`${PATH}/${slug}`, '_blank', 'noopener,noreferrer');
                    } else {
                      window.alert(formatMessage({ id: 'slugMissing', defaultMessage: 'Það vantar slug' }));
                    }
                  },
                },
              ]}
            />
          </Box>
        </Column>
      </Row>
      <Divider />
    </Box>
  )
}
