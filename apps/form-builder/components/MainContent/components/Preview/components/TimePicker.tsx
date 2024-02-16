import { useState } from 'react';
import { GridColumn, GridRow, Input } from '@island.is/island-ui/core';

export default function TimePicker() {
    const [time, setTime] = useState('');

    const handleChange = (e) => {
        let value = e.target.value;
        // Remove any non-digit characters
        value = value.replace(/\D/g, '');
        // Limit input to maximum length of 4 characters
        value = value.substring(0, 4);
        // Insert ":" if the second digit is entered for hours
        if (value.length >= 2 && value.indexOf(':') === -1) {
            value = value.substring(0, 2) + ':' + value.substring(2);
        }
        // Handle backspace when there are two numbers and a ":"
        if (e.nativeEvent.inputType === 'deleteContentBackward' && value.length === 3 && value.indexOf(':') === 2) {
            value = value.substring(0, 1);
        }
        // Update the state
        setTime(value);
    };

    return (
        <GridRow marginTop={1}>
            <GridColumn span="2/12">
                <Input
                    maxLength={5} // Maximum length for HH:mm format
                    value={time}
                    onChange={handleChange}
                    name=""
                    label="Tími"
                    inputMode='decimal'
                />
            </GridColumn>
        </GridRow>
    );
}
