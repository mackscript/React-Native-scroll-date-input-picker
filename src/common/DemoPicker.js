import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Gradiant from './Gradiant';
const {height} = Dimensions.get('window');
const itemHeight = 50;
const shortMonthsArray = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
// for date
const generateDaysArray = (month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = day;
    daysArray.push(date);
  }

  return daysArray;
};
//// Generate days for January 2024

// for years
const generateYearsArray = lastYear => {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];

  for (let year = lastYear; year <= currentYear; year++) {
    yearsArray.push(year);
  }

  return yearsArray;
};

const DemoPicker = ({
  visible = false,
  closeModal = () => {},
  onSelected = () => {},
  lastYear = '2004',
}) => {
  // Usage example:
  const yearsArray = generateYearsArray(lastYear);

  const visibleItemCount = 3; // Number of items to show (3 items)
  const repeatCount = 1000; // Arbitrary large number to simulate infinite scroll

  // Years
  const [allYears, setAllYears] = useState(yearsArray);
  const flatListRefYear = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editableValue, setEditableValue] = useState(String(yearsArray[0]));

  // months
  const [allMonths, setAllMonths] = useState(shortMonthsArray);
  const flatListRefMonths = useRef(null);
  const [selectedMonthsIndex, setSelectedMonthsIndex] = useState(0);
  const [editableMonthsValue, setEditableMonthsValue] = useState(
    String(shortMonthsArray[0]),
  );
  const [monthsIndex, setMonthIndex] = useState(1);
  const daysArray = generateDaysArray(monthsIndex, editableValue);

  // date
  const [allDate, setAllDate] = useState(daysArray);
  const flatListRefDate = useRef(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [editableDateValue, setEditableDateValue] = useState(
    String(daysArray[0]),
  );

  // Years scroll useEffect
  useEffect(() => {
    if (flatListRefYear.current) {
      setTimeout(() => {
        flatListRefYear.current.scrollToOffset({
          offset: selectedIndex * itemHeight,
          animated: false,
        });
      }, 0);
    }
  }, [selectedIndex]);

  // Months scroll useEffect
  useEffect(() => {
    if (flatListRefMonths.current) {
      setTimeout(() => {
        flatListRefMonths.current.scrollToOffset({
          offset: selectedMonthsIndex * itemHeight,
          animated: false,
        });
      }, 0);
    }
  }, [selectedMonthsIndex]);

  // Years scroll useEffect
  useEffect(() => {
    if (flatListRefDate.current) {
      setTimeout(() => {
        flatListRefDate.current.scrollToOffset({
          offset: selectedDateIndex * itemHeight,
          animated: false,
        });
      }, 0);
    }
  }, [selectedDateIndex]);

  useEffect(() => {
    setAllDate(daysArray);
  }, []);

  // Center the selected item
  const getItemLayout = (_, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  // Center the selected item
  const getItemLayoutMonths = (_, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  // Center the selected item
  const getItemLayoutDate = (_, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });
  // Years
  const handleScrollEndYears = event => {
    const yOffset = event.nativeEvent.contentOffset.y;

    // Ensure itemHeight is properly defined and not zero
    if (itemHeight <= 0) {
      console.error('itemHeight must be greater than 0');
      return;
    }

    // Calculate index based on scroll offset
    const index = Math.round(yOffset / itemHeight);

    console.log('index', index, yOffset);

    // Update selected index state
    setSelectedIndex(index);

    // Calculate actual index in the array
    const actualIndex = index % yearsArray.length;

    // Ensure index is positive
    const validIndex =
      actualIndex >= 0 ? actualIndex : actualIndex + yearsArray.length;

    // Get selected value and update editable value state
    const selectedValue = yearsArray[validIndex];
    setEditableValue(String(selectedValue));
  };

  // months
  const handleScrollEndMonths = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / itemHeight);
    setSelectedMonthsIndex(index);

    const actualIndex = index % shortMonthsArray.length;
    const selectedValue =
      shortMonthsArray[
        actualIndex >= 0 ? actualIndex : actualIndex + shortMonthsArray.length
      ];

    setEditableMonthsValue(String(selectedValue));
    const newIndex = shortMonthsArray.findIndex(item => item === selectedValue);
    setMonthIndex(newIndex + 1);

    const newDateArray = generateDaysArray(newIndex + 1, editableValue);
    setAllDate(newDateArray);
  };

  // months
  const handleScrollEndDate = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / itemHeight);
    setSelectedDateIndex(index);

    const actualIndex = index % daysArray.length;
    const selectedValue =
      daysArray[
        actualIndex >= 0 ? actualIndex : actualIndex + daysArray.length
      ];

    setEditableDateValue(String(selectedValue));
  };

  // Yearss
  const applyNewValue = newText => {
    const numericValue = parseInt(newText, 10);
    const newIndex = yearsArray.findIndex(item => item === numericValue);

    if (newIndex !== -1) {
      setEditableValue(`${numericValue}`);
      flatListRefYear.current.scrollToOffset({
        offset: newIndex * itemHeight,
        animated: true,
      });
      setSelectedIndex(newIndex);
    } else {
      setEditableValue('2004');
      flatListRefYear.current.scrollToOffset({
        offset: 0 * itemHeight,
        animated: true,
      });
      setSelectedIndex(0);
    }
  };

  // montths
  const applyNewMonthsValue = newText => {
    // Validate and find the typed month
    const newIndex = shortMonthsArray.findIndex(
      item => item.toLowerCase() === newText.toLowerCase(),
    );

    if (newIndex !== -1) {
      setEditableMonthsValue(newText);

      flatListRefMonths.current.scrollToOffset({
        offset: newIndex * itemHeight,
        animated: true,
      });
      setMonthIndex(newIndex + 1);
      setSelectedMonthsIndex(newIndex);
      const newDateArray = generateDaysArray(newIndex + 1, editableValue);
      setAllDate(newDateArray);
    } else {
      setEditableMonthsValue('Jan');
      flatListRefMonths.current.scrollToOffset({
        offset: 0 * itemHeight,
        animated: true,
      });
      setSelectedMonthsIndex(0);
      setMonthIndex(1);
      const newDateArray = generateDaysArray(1, editableValue);
      setAllDate(newDateArray);
      setSelectedDateIndex(0);
    }
  };

  // montths
  const applyNewDateValue = newText => {
    const numericValue = parseInt(newText, 10);
    const newIndex = daysArray.findIndex(item => item === numericValue);
    if (newIndex !== -1) {
      setEditableDateValue(`${newText}`);

      flatListRefDate.current.scrollToOffset({
        offset: newIndex * itemHeight,
        animated: true,
      });
      setSelectedDateIndex(newIndex);
    } else {
      console.log('call out');
      setEditableDateValue('1');
      flatListRefDate.current.scrollToOffset({
        offset: 0 * itemHeight,
        animated: true,
      });
      setSelectedDateIndex(0);
    }
  };
  // Years ;
  const handleEdit = newText => {
    const isValid = yearsArray.some(number =>
      number.toString().startsWith(newText),
    ); // If valid, update state; otherwise, do nothing
    if (isValid || newText === '') {
      setEditableValue(newText);
    }
  };

  const handleEditSubmit = () => {
    applyNewValue(editableValue);
  };

  // months;

  const handleEditMonths = newText => {
    const isValid = shortMonthsArray.some(month =>
      month.toLowerCase().startsWith(newText.toLowerCase()),
    );
    // If valid, update state; otherwise, do nothing
    if (isValid || newText === '') {
      setEditableMonthsValue(newText);
    }
  };

  const handleEditMonthsSubmit = () => {
    applyNewMonthsValue(editableMonthsValue);
  };

  // months;

  const handleEditDates = newText => {
    const isValid = daysArray.some(number =>
      number.toString().startsWith(newText),
    ); // If valid, update state; otherwise, do nothing
    if (isValid || newText === '') {
      setEditableDateValue(newText);
    }
  };

  const handleEditDatesSubmit = () => {
    applyNewDateValue(editableDateValue);
  };

  const renderItem = ({item, index}) => {
    const isMiddleItem = selectedIndex === index;
    return (
      <View style={[styles.itemContainer, {height: itemHeight}]}>
        {isMiddleItem ? (
          <TextInput
            style={[
              styles.itemText,
              styles.selectedText,
              {textAlign: 'center', borderWidth: 1},
            ]}
            value={editableValue}
            onChangeText={handleEdit}
            onBlur={handleEditSubmit}
            onSubmitEditing={handleEditSubmit}
            keyboardType="numeric"
          />
        ) : (
          <Text style={[styles.itemText]}>{item}</Text>
        )}
      </View>
    );
  };

  const renderMonths = ({item, index}) => {
    const isMiddleItemMonths = selectedMonthsIndex === index;

    return (
      <View style={[styles.itemContainer, {height: itemHeight}]}>
        {isMiddleItemMonths ? (
          <TextInput
            style={[
              styles.itemText,
              styles.selectedText,
              {textAlign: 'center'},
            ]}
            value={editableMonthsValue}
            onChangeText={handleEditMonths}
            onBlur={handleEditMonthsSubmit}
            onSubmitEditing={handleEditMonthsSubmit}
          />
        ) : (
          <Text style={[styles.itemText]}>{item}</Text>
        )}
      </View>
    );
  };

  const renderDates = ({item, index}) => {
    const isMiddleItemMonths = selectedDateIndex === index;

    return (
      <View style={[styles.itemContainer, {height: itemHeight}]}>
        {isMiddleItemMonths ? (
          <TextInput
            style={[
              styles.itemText,
              styles.selectedText,
              {textAlign: 'center', borderWidth: 1},
            ]}
            value={editableDateValue}
            onChangeText={handleEditDates}
            onBlur={handleEditDatesSubmit}
            onSubmitEditing={handleEditDatesSubmit}
          />
        ) : (
          <Text style={[styles.itemText]}>{item}</Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    console.log('out close modal ');
    setMonthIndex(1);
    setSelectedIndex(0);
    setSelectedMonthsIndex(0);
    setSelectedDateIndex(0);
    setEditableValue(String(yearsArray[0]));
    setEditableMonthsValue(String(shortMonthsArray[0]));
    setEditableDateValue(String(daysArray[0]));
  }, [visible]);

  const closeDateModal = () => {
    closeModal();
  };
  const confrimDate = () => {
    console.log('monthsIndex ------->');
    // let date = new Date('2024-08-02');
    // onSelected(date);
    Alert.alert(
      'Alert Title',
      `${editableDateValue}/${monthsIndex}/${editableValue}`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      onRequestClose={() => closeModal()}>
      <View style={styles.modalContainer}>
        <View style={styles.modalCenterView}>
          <View style={styles.dateContiner}>
            {/* // months // */}
            <View style={{width: 80}}>
              <View
                style={[
                  styles.pickerContainer,
                  {height: visibleItemCount * itemHeight},
                ]}>
                <FlatList
                  ref={flatListRefMonths}
                  onEndReachedThreshold={0.5}
                  onEndReached={() =>
                    setAllMonths([...allMonths, ...shortMonthsArray])
                  }
                  data={allMonths}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={renderMonths}
                  getItemLayout={getItemLayoutMonths}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  onMomentumScrollEnd={handleScrollEndMonths}
                  // initialScrollIndex={selectedIndex}
                />
                <View
                  style={[styles.selectedItemOverlay, {height: itemHeight}]}
                />
              </View>
            </View>
            {/* // Dates // */}
            <View style={{width: 80}}>
              <View
                style={[
                  styles.pickerContainer,
                  {height: visibleItemCount * itemHeight},
                ]}>
                <FlatList
                  ref={flatListRefDate}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => setAllDate([...allDate, ...daysArray])}
                  data={allDate}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={renderDates}
                  getItemLayout={getItemLayoutDate}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  onMomentumScrollEnd={handleScrollEndDate}
                  // initialScrollIndex={selectedIndex}
                />
                <View
                  style={[styles.selectedItemOverlay, {height: itemHeight}]}
                />
              </View>
            </View>
            {/* // Year // */}
            <View style={{width: 80}}>
              <View
                style={[
                  styles.pickerContainer,
                  {height: visibleItemCount * itemHeight},
                ]}>
                <FlatList
                  ref={flatListRefYear}
                  onEndReachedThreshold={0.5}
                  onEndReached={() => setAllYears([...allYears, ...yearsArray])}
                  data={allYears}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={renderItem}
                  getItemLayout={getItemLayout}
                  snapToInterval={itemHeight}
                  decelerationRate="fast"
                  showsVerticalScrollIndicator={false}
                  onMomentumScrollEnd={handleScrollEndYears}
                  // initialScrollIndex={selectedIndex}
                />
                <View
                  style={[styles.selectedItemOverlay, {height: itemHeight}]}
                />
              </View>
            </View>
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => closeDateModal()}>
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => confrimDate()}>
              <Text style={styles.modalText}>Set</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DemoPicker;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenterView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fdba74',
  },
  btnGroup: {
    marginTop: 8,
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  closeBtn: {
    marginHorizontal: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  dateContiner: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  pickerContainer: {
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    textTransform: 'capitalize',
    fontSize: 20,
    color: '#888',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedItemOverlay: {
    position: 'absolute',
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
