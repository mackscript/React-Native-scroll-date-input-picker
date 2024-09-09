import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';

import RnDateInputPicker from './src/components';

const App = () => {
  const [showDateModal, setShowDateModal] = useState(false);
  const [newdate, setNewDate] = useState(new Date());
  const closeModal = () => {
    setShowDateModal(false);
  };
  const onSelected = values => {
    // setNewDate(date);
    setNewDate(values.date);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
      }}>
      <Button
        title={`${newdate.toDateString()}`}
        onPress={() => setShowDateModal(true)}
      />
      <RnDateInputPicker
        lastYear="1900"
        defaultDate={newdate} // 2024-09-09T11:33:40.097Z
        visible={showDateModal} // show Modal
        closeModal={closeModal} // close Modal
        onSelected={onSelected} // seleted Date
      />
    </View>
  );
};

export default App;
