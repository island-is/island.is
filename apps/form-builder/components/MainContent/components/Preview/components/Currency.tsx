import {
  GridRow as Row,
  GridColumn as Column,
  Input,
} from '@island.is/island-ui/core'
import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'

export default function Currency({ label }: { label: string }) {
  const [currency, setCurrency] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const [selection, setSelection] = useState<[number | null, number | null] | null>(null);

  const handleCurrencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.persist();

    // Remove any non-digit characters from the input value
    let inputValue = e.target.value.replace(/\D/g, '');

    // Allow a single zero but remove it if it's a leading zero
    if (inputValue.length > 1 && inputValue.startsWith('0')) {
      inputValue = inputValue.slice(1);
    }

    // Format the input value by adding dots every three characters
    const formattedValue = formatCurrency(inputValue);

    // Calculate the new cursor position after formatting
    const newCursorPosition = calculateNewCursorPosition(
      e.target.selectionStart,
      e.target.selectionEnd,
      e.target.value,
      formattedValue
    );

    // Set the currency state
    setCurrency(formattedValue);

    // Set the selection range based on the new cursor position
    setSelection([newCursorPosition, newCursorPosition]);
  };

  useLayoutEffect(() => {
    if (selection && ref.current) {
      // Set the selection range
      [ref.current.selectionStart, ref.current.selectionEnd] = selection;
    }
  }, [selection]);

  const formatCurrency = (value: string): string => {
    // Add a dot every three characters
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const calculateNewCursorPosition = (
    start: number,
    end: number,
    prevValue: string,
    formattedValue: string
  ): number => {
    // Calculate the number of added dots
    const addedDots = formattedValue.slice(0, start).match(/\./g)?.length || 0;
    // Calculate the number of dots before the new cursor position
    const dotsBeforeCursor = prevValue.slice(0, start).match(/\./g)?.length || 0;
    // Adjust the cursor position by the difference in the number of dots
    return start + (addedDots - dotsBeforeCursor);
  };

  return (
    <Row marginTop={2}>
      <Column span="10/10">
        <Input
          ref={ref}
          label={label}
          name={'Currency'}
          value={currency}
          onChange={handleCurrencyChange}
        />
      </Column>
    </Row>
  );
}
