import { m } from '@island.is/form-system/ui'
import { Box, Breadcrumbs, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import cn from 'classnames'
import { useContext, useState } from 'react'
import { useLocation } from 'react-router'
import { ControlContext } from '../../context/ControlContext'
import { FormSystemPaths } from '../../lib/paths'
import { FormHeader } from '../../screens/Form/FormHeader'
import { MainContentColumn } from './components/MainColumns'
import { NavbarColumn } from './components/NavbarColumn'
import * as styles from './FormLayout.css'

export const FormLayout = () => {
  const { formatMessage, lang } = useLocale()
  const { control } = useContext(ControlContext)
  const { name } = control.form
  const [mobileNavOpen, setMobileNavOpen] = useState(true)
  const location = useLocation()
  return (
    <>
      <Box marginBottom={4}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: '/stjornbord' },
            {
              title: formatMessage(m.rootName),
              href: `/stjornbord${FormSystemPaths.FormSystemRoot}${location.search}`,
            },
            {
              title: name[lang] ?? '',
            },
          ]}
        />
      </Box>
      <Box className={styles.mobileNavToggle} marginBottom={2}>
        <Button
          variant="ghost"
          size="small"
          icon={mobileNavOpen ? 'chevronUp' : 'chevronDown'}
          iconType="filled"
          onClick={() => setMobileNavOpen((prev) => !prev)}
        >
          {mobileNavOpen
            ? formatMessage(m.hideSidebar)
            : formatMessage(m.showSidebar)}
        </Button>
      </Box>
      <FormHeader />
      <Box className={styles.layoutRow}>
        <Box
          className={cn(styles.navColumn, {
            [styles.mobileNavHidden]: !mobileNavOpen,
          })}
        >
          <NavbarColumn />
        </Box>
        <Box className={styles.mainContentColumn}>
          <MainContentColumn />
        </Box>
      </Box>
    </>
  )
}
