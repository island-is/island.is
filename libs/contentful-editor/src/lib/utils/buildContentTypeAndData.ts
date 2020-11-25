import { ContentType } from 'contentful';
import { Collection } from 'contentful-management/dist/typings/common-types';
import { ContentFields } from 'contentful-management/dist/typings/entities/content-type-fields';
import { Entry, EntryProp } from 'contentful-management/dist/typings/entities/entry';
import { FieldAPI } from 'contentful-ui-extensions-sdk/typings';

import { ContentfulEnv, createContentfulClient } from '../contentful/client'

interface BuildContentTypeAndDataProps {
  slug: string;
  contentType: string;
  locale: 'en' | 'is-IS'
  env: ContentfulEnv
}

export interface MagicType {
  _entry: Collection<Entry, EntryProp>,
  _type: ContentType
  fields: FieldAPI[]
}

export const buildContentTypeAndData = async ({ slug, contentType, locale, env }: BuildContentTypeAndDataProps) => {
  const client = (await createContentfulClient(env)).env;

  // We get the entry content
  const entry = await client.getEntries({
    content_type: contentType,
    'fields.slug': slug,
    locale,
  })

  // We get the entry contentType
  const type = await client.getContentType(contentType)

  console.log('-type', type.fields);

  // We merge both objects together to fit the contentful fields API
  const fields = type
    .fields
    .filter((field) => field.id === 'title' || field.id === 'intro' || field.id === 'content') // TEMP
    .map(field => {
      return {
        id: field.id,
        locale,
        type: field.type,
        required: field.required,
        validations: field.validations,
        items: field.items,
        getValue: () => {
          const entryFields = entry.items?.[0].fields
          const fieldName = Object.keys(entryFields).find(entryField => entryField === field.id)

          console.log('-entryFields', entryFields);
          console.log('-fieldName', fieldName);

          if (!fieldName) {
            return undefined;
          }

          const obj = entryFields?.[fieldName]?.[locale];
          console.log('-obj', obj);

          if (obj?.nodeType === 'document') {
            // console.log('-obj', obj);
            return obj;
          }

          return obj;
        },
        // setValue: (value: any) => Promise<any>,
        setValue: () => undefined,
        // removeValue: () => Promise<void>,
        removeValue: () => null,
        // setInvalid: (value: boolean) => void,
        setInvalid: () => null,
        // onValueChanged: (callback: (value: any) => void) => () => void,
        onValueChanged: () => () => null,
        // onIsDisabledChanged: (callback: (isDisabled: boolean) => void) => () => void,
        onIsDisabledChanged: () => () => null,
        // onSchemaErrorsChanged: (callback: (errors: Error[]) => void) => () => void,
        onSchemaErrorsChanged: () => () => null,
      }
    })

  // We return the original objects + our modified object
  return {
    _entry: entry,
    _type: type,
    fields,
  }
}
