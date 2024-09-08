# rn-wheel-scroll-date-input-picker

A simple and customizable scrollable date picker for React Native, allowing users to input or select dates with a custom text field.

## Installation

To install the package, run:

```bash
npm install rn-wheel-scroll-date-input-picker
```

Or using Yarn:

```bash
yarn add rn-wheel-scroll-date-input-picker
```

## Usage

Here's how you can use rn-wheel-scroll-date-input-picker in your project:

```bash
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import RnDateInputPicker from 'rn-wheel-scroll-date-input-picker';

const App = () => {
  const [date, setDate] = useState(null);

 const onSelected = d => {
    console.log('date', d);
    setDate(d)
};

  return (
    <View>
      <Button title="Select Date" onPress={() => setShowDateModal(true)} />
       <RnDateInputPicker
        defaultDate={'2024-08-02'} // yyyy-mm-dd
        visible={showDateModal} // show Modal
        closeModal={closeModal} // close Modal
        onSelected={onSelected} // seleted Date
      />
    </View>
  );
};

export default App;
```
