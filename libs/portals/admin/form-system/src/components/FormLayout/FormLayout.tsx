import { m } from '@island.is/form-system/ui'
import {
  Box,
  Breadcrumbs,
  GridColumn as Column,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext } from 'react'
import { ControlContext } from '../../context/ControlContext'
import { FormSystemPaths } from '../../lib/paths'
import { FormHeader } from '../../screens/Form/FormHeader'
import { MainContentColumn } from './components/MainColumns'
import { NavbarColumn } from './components/NavbarColumn'

export const FormLayout = () => {
  const { formatMessage, lang } = useLocale()
  const { control } = useContext(ControlContext)
  const { name } = control.form
  return (
    <>
      <Box marginBottom={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: '/stjornbord' },
            {
              title: formatMessage(m.rootName),
              href: `/stjornbord${FormSystemPaths.FormSystemRoot}`,
            },
            {
              title: name[lang] ?? '',
            },
          ]}
        />
      </Box>
      <FormHeader />
      <Row>
        <Column span="3/12">
          <NavbarColumn />
        </Column>
        <Column span="9/12">
          <MainContentColumn />
        </Column>
      </Row>
    </>
  )
}
