import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';

import DemoPicker from './src/common/DemoPicker';
import RnDateInputPicker from './src/components';

const App = () => {
  const [showDateModal, setShowDateModal] = useState(false);
  const closeModal = () => {
    setShowDateModal(false);
  };
  const onSelected = date => {
    console.log('date nice date', date);
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
      }}>
      <Button title="Select Date" onPress={() => setShowDateModal(true)} />
      <RnDateInputPicker
        // defaultDate={'2024-08-02'} // yyyy-mm-dd
        visible={showDateModal} // show Modal
        closeModal={closeModal} // close Modal
        onSelected={onSelected} // seleted Date
      />
      {/* <DemoPicker
        lastYear={'1900'}
        // YYYY-MM-DD
        visible={showDateModal} // show Modal
        closeModal={closeModal} // close Modal
        onSelected={onSelected} // seleted Date
      /> */}
    </View>
  );
};

export default App;
