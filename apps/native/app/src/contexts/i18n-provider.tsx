import React from 'react';
import { IntlProvider } from 'react-intl';
import { usePreferencesStore } from '../stores/preferences-store';
import { is, en } from '../messages';

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { locale } = usePreferencesStore();
  return (
    <IntlProvider locale={locale} messages={locale === 'is-IS' ? is : en}>
      {children}
    </IntlProvider>
  );
}
