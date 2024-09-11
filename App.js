import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';
import RnDateInputPicker from './src/components/customDatePicker';
import TarotsCards from './src/components/TarotCards/TarotsCards';

const App = () => {
  const [showDateModal, setShowDateModal] = useState(false);
  const [newdate, setNewDate] = useState(new Date());
  const closeModal = () => {
    setShowDateModal(false);
  };

  const onSelected = values => {
    setNewDate(values.date);
  };

  console.log('newdate', newdate);

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#fefefe',
      }}>
      <TarotsCards />
      {/* <Button
        title={`${newdate.toDateString()}`}
        onPress={() => setShowDateModal(true)}
      />
      <RnDateInputPicker
        btnColor="blue"
        activeTextColor="red"
        lastYear="1900"
        defaultDate={newdate} // 2024-09-09T11:33:40.097Z
        visible={showDateModal} // show Modal
        closeModal={closeModal} // close Modal
        onSelected={onSelected} // seleted Date
      /> */}
    </View>
  );
};

export default App;
