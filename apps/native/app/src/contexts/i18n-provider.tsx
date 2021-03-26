import React from 'react';
import { IntlProvider } from 'react-intl';
import { userPreferencesStore } from '../stores/preferences-store';

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = userPreferencesStore();
  return (
    // <IntlProvider locale={locale}>
    <>
      {children}
      </>
    // </IntlProvider>
  );
}
