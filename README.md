# react-native-scroll-datepicker-with-textfield

A simple and customizable scrollable date picker for React Native, allowing users to input or select dates with a custom text field.

## Installation

To install the package, run:

```bash
npm install react-native-scroll-datepicker-with-textfield
```

Or using Yarn:

```bash
yarn add react-native-scroll-datepicker-with-textfield
```

## Usage

Here's how you can use react-native-scroll-datepicker-with-textfield in your project:

```bash
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import ScrollDatePickerWithTextField from 'react-native-scroll-datepicker-with-textfield';

const App = () => {
  const [date, setDate] = useState(null);

  return (
    <View>
      <Text>Select a Date:</Text>
      <ScrollDatePickerWithTextField
        selectedDate={date}
        onDateChange={setDate}
        placeholder="Select Date"
        customTextFieldStyle={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
        dateFormat="DD/MM/YYYY"
      />
    </View>
  );
};

export default App;
```
