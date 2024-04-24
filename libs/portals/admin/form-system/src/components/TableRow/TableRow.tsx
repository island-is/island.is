import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Divider,
  Box,
  DropdownMenu,
  Button,
} from '@island.is/island-ui/core'
import * as styles from './TableRow.css'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TranslationTag from '../TranslationTag/TranslationTag'
import { formatDate } from '../../utils/formatDate'
import { FormSystemPaths } from '../../lib/paths'
import {
  LicenseProviderEnum,
  ApplicationTemplateStatus,
} from '../../lib/utils/interfaces'

interface Props {
  id?: number | null
  name?: string
  created?: Date
  lastModified?: Date
  org?: number | null
  state?: number
  options?: string
  isHeader: boolean
  translated?: boolean
}

interface ColumnTextProps {
  text: string | number
}

const ColumnText = ({ text }: ColumnTextProps) => (
  <Box width="full" textAlign="left" paddingLeft={1}>
    <Text variant="medium">{text}</Text>
  </Box>
)

const TableRow = ({
  id,
  name,
  lastModified,
  org,
  state,
  isHeader,
  translated,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  if (isHeader) return header()
  return (
    <Box
      paddingTop={2}
      paddingBottom={1}
      onClick={() => setIsOpen(!isOpen)}
      style={{ cursor: '' }}
    >
      <Row key={id}>
        <Column span="1/12">
          <ColumnText text={id ? id : ''} />
        </Column>
        <Column span="4/12">
          <ColumnText text={name ? name : ''} />
        </Column>
        <Column span="2/12">
          <ColumnText
            text={formatDate(lastModified ? lastModified : new Date())}
          />
        </Column>
        <Column span="1/12">
          <Box display="flex">
            <TranslationTag translated={translated ? translated : false} />
          </Box>
        </Column>
        <Column span="2/12">
          <ColumnText text={LicenseProviderEnum[org ? org : 1]} />
        </Column>
        <Column span="1/12">
          <ColumnText text={ApplicationTemplateStatus[state ? state : 0]} />
        </Column>
        <Column span="1/12">
          <Box display="flex" justifyContent={'center'} alignItems={'center'}>
            <DropdownMenu
              menuLabel={`Aðgerðir ${name}`}
              disclosure={
                <Button
                  icon="menu"
                  circle
                  colorScheme="negative"
                  title="Aðgerðir"
                  inline
                  aria-label={`Aðgerðir`}
                />
              }
              items={[
                {
                  title: 'Breyta',
                  onClick: () => {
                    navigate(
                      FormSystemPaths.Form.replace(':formId', String(id)),
                      {
                        state: {
                          formId: id,
                        },
                      },
                    )
                  },
                },
                {
                  title: 'Afrita',
                },
                {
                  title: 'Þýðing enska',
                },
                {
                  title: 'Sækja slóð',
                },
                {
                  title: 'Export',
                },
                {
                  title: 'Sækja json',
                },
              ]}
            />
          </Box>
        </Column>
      </Row>
      <Box>
        {isOpen === true ? (
          <motion.div
            key={id}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.5,
              },
            }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence>
              <Box style={{ height: '50px' }}></Box>
            </AnimatePresence>
          </motion.div>
        ) : null}
        <Divider />
      </Box>
    </Box>
  )
}

export default TableRow

const header = () => (
  <>
    <Box className={styles.header}>
      <Row>
        <Column span="1/12">
          <Text variant="medium">Númer</Text>
        </Column>
        <Column span="4/12">
          <Text variant="medium">Heiti</Text>
        </Column>
        <Column span="2/12">
          <Text variant="medium">Síðast breytt</Text>
        </Column>
        <Column span="1/12">
          <Text variant="medium">Þýðingar</Text>
        </Column>
        <Column span="2/12">
          <Text variant="medium">Stofnun</Text>
        </Column>
        <Column span="1/12">
          <Text variant="medium">Staða</Text>
        </Column>
        <Column span="1/12">
          <Text variant="medium">Aðgerðir</Text>
        </Column>
      </Row>
    </Box>
  </>
)
