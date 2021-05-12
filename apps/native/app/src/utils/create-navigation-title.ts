import { theme } from "@island.is/island-ui/theme";
import { useIntl } from "react-intl";
import { Navigation, OptionsTopBarTitle } from "react-native-navigation";
import { TranslatedMessage } from '../messages/index';
import { preferencesStore } from "../stores/preferences-store";
import { is, en } from '../messages/index';
import { useEffect } from "react";

interface CreateNavigationFn {
  useNavigationTitle(componentId: string): void;
  title: OptionsTopBarTitle;
}

export function createNavigationTitle(titleMsg: TranslatedMessage): CreateNavigationFn {
  const { locale } = preferencesStore.getState();
  const messages = locale === 'is-IS' ? is : en;
  const initialTitle = messages[titleMsg];

  const title: OptionsTopBarTitle = {
    text: initialTitle,
    fontFamily: 'IBMPlexSans-SemiBold',
    color: theme.color.dark400,
    alignment: 'center',
  };

  const sub = preferencesStore.subscribe((newLocale) => {
    const messages = newLocale === 'is-IS' ? is : en;
    title.text = messages[titleMsg];
    sub();
  }, s => s.locale);

  return {
    useNavigationTitle(componentId: string) {
      const intl = useIntl();
      useEffect(() => {
        const translatedTitle = intl.formatMessage({ id: titleMsg });
        if (componentId) {
          Navigation.mergeOptions(componentId, {
            topBar: {
              title: {
                text: translatedTitle,
              },
            }
          });
        }
        // Navigation.updateProps(componentId, {
        //   title,
        // });
      }, [intl]);
    },
    title,
  };
}
