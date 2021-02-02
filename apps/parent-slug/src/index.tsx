import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { HelpText, TextInput } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import slugify from 'slugify';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface ReferenceLink {
  sys: {
    id: string;
    linkType: string;
    type: string;
  };
}

interface ParentEntry {
  fields: { url?: { [locale: string]: string }; slug: { [locale: string]: string } };
}

export const App = ({ sdk }: AppProps) => {
  const entryTitle = (sdk.entry.fields.title.getValue() as string) || '';
  const [slug, setSlug] = useState<string>(
    sdk.field.getValue() || slugify(entryTitle.toLowerCase())
  );
  const [slugPrefix, setSlugPrefix] = useState<string>('');
  const [oldSlugPrefix, setOldSlugPrefix] = useState<string>('');
  const locale = sdk.field.locale;
  const maxDepth = 4;
  const hasNestedError = slug.split('/').length - 1 >= maxDepth;

  // Monitor parent field changes
  const handleParentChange = useCallback(
    (parentRef: ReferenceLink) => {
      if (parentRef) {
        sdk.space.getEntry<ParentEntry>(parentRef.sys.id).then(parentEntry => {
          setOldSlugPrefix(slugPrefix); // so we can remove slug prefix from slug later
          const parentSlug = parentEntry.fields.url || parentEntry.fields.slug;
          setSlugPrefix(`/${parentSlug[locale]}/`);
        });
      } else {
        setSlugPrefix('');
      }
    },
    [slugPrefix]
  );

  useEffect(() => {
    const parentField = sdk.entry.fields.parent;
    const clearHandler = parentField.onValueChanged(handleParentChange);

    if (slugPrefix === '') {
      // remove old prefix from slug
      updateValue(slug.replace(oldSlugPrefix, ''));
    } else {
      // update prefix in slug
      updateValue(getDisplayedSlug());
    }

    return clearHandler;
  }, [slugPrefix]);

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk]);

  const getDisplayedSlug = () => slug.replace(slugPrefix, '');
  const updateValue = (value: string) => {
    const newSlug = `${slugPrefix}${value}`;
    setSlug(newSlug);
    sdk.field.setValue(newSlug);
  };

  sdk.field.setInvalid(hasNestedError);

  return (
    <>
      <TextInput
        type="text"
        id="slug-field"
        value={getDisplayedSlug()}
        error={hasNestedError}
        onChange={({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>) =>
          updateValue(value)
        }
      />
      <HelpText>
        <strong>{slugPrefix}</strong>
        {getDisplayedSlug()}
      </HelpText>
    </>
  );
};

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }

// TODO: Take in max depth as param
// TODO: Make submit fail if has validation error
