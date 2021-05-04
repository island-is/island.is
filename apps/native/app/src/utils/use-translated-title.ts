import { useEffect } from "react";
import { Navigation } from 'react-native-navigation';
import { TranslatedMessage } from "../messages";
import { useIntl } from '../utils/intl';

export function useTranslatedTitle(componentId: string, messageId: TranslatedMessage) {
  const intl = useIntl()
  useEffect(() => {
    Navigation.updateProps(componentId, {
      title: intl.formatMessage({ id: messageId }),
    })
  }, [intl]);
}
