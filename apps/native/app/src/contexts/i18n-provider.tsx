import React from 'react';
import { IntlProvider } from 'react-intl';
import { usePreferencesStore } from '../stores/preferences-store';

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = usePreferencesStore();
  return (
    <IntlProvider locale={locale}>
      {children}
    </IntlProvider>
  );
}
