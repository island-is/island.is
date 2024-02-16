import React, { ChangeEvent, useContext } from 'react';
import {
  GridRow as Row,
  GridColumn as Column,
  Input,
  Checkbox,
  Stack,
} from '@island.is/island-ui/core';
import FormBuilderContext from '../../../../../context/FormBuilderContext';
import { IInput } from '../../../../../types/interfaces';
import { translationStation } from '../../../../../services/translationStation';

export default function MessageWithLink() {
  const { lists, listsDispatch, setIsTyping, onFocus, blur } =
    useContext(FormBuilderContext);
  const { activeItem } = lists;
  const currentItem = activeItem.data as IInput;
  const { inputSettings } = currentItem;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    listsDispatch({
      type: 'setMessageWithLinkSettings',
      payload: {
        property: 'erHlekkur',
        checked: e.target.checked,
      },
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: string
  ) => {
    setIsTyping(true);
    listsDispatch({
      type: 'setMessageWithLinkSettings',
      payload: {
        property: 'hnapptexti',
        lang,
        value: e.target.value,
      },
    });
  };

  const handleTranslateButtonClick = async () => {
    const translation = await translationStation(inputSettings?.hnapptexti?.is);
    listsDispatch({
      type: 'setMessageWithLinkSettings',
      payload: {
        property: 'hnapptexti',
        lang: 'en',
        value: translation.translations[0].translatedText,
      },
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    listsDispatch({
      type: 'setMessageWithLinkSettings',
      payload: {
        property: 'url',
        value: e.target.value,
      },
    });
  };

  return (
    <Stack space={2}>
      <Row>
        <Column>
          <Checkbox
            label="Bæta við hlekk"
            checked={inputSettings?.erHlekkur}
            onChange={handleCheckboxChange}
          />
        </Column>
      </Row>
      {inputSettings !== undefined && inputSettings.erHlekkur && (
        <Stack space={2}>
          <Row>
            <Column span="5/10">
              <Input
                label="hnapptexti"
                name="buttonTitle"
                backgroundColor="blue"
                value={inputSettings.hnapptexti?.is}
                onChange={(e) => handleInputChange(e, 'is')}
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
              />
            </Column>
            <Column span="5/10">
              <Input
                label="hnapptexti (enska)"
                name="buttonTitle"
                backgroundColor="blue"
                value={inputSettings.hnapptexti?.en}
                onChange={(e) => handleInputChange(e, 'en')}
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
                buttons={[
                  {
                    label: 'translate',
                    name: 'reader',
                    onClick: handleTranslateButtonClick,
                  },
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label="Url"
                name="url"
                backgroundColor="blue"
                placeholder="island.is"
                value={inputSettings?.url}
                onChange={handleUrlChange}
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
              />
            </Column>
          </Row>
        </Stack>
      )}
    </Stack>
  );
}
