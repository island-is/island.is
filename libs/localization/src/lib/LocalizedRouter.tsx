import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { Locale, defaultLanguage, LocaleProvider } from './LocaleContext'

interface Props {
  RouterComponent: React.ComponentClass<any>
  defaultLanguage?: Locale
  children: React.ReactElement | any
}

export const LocalizedRouter: React.FC<Props> = ({
  children,
  RouterComponent,
}) => (
  <RouterComponent>
    <Route path="/:lang([a-z]{2})?">
      {({ match }) => {
        const params = match ? match.params : {}
        const { lang = defaultLanguage } = params

        return (
          <LocaleProvider locale={lang} messages={{}}>
            {typeof children === 'function' ? children({ match }) : children}
          </LocaleProvider>
        )
      }}
    </Route>
  </RouterComponent>
)
