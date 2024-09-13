import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import SingelDatePicker from './tarotCards';
import Gradiant from './Gradiant';
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
function logFormattedDate(dateString) {
  const date = new Date(dateString); // Create Date object from string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so +1
  const day = String(date.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  return {
    formattedDate,
    day,
    month,
    year,
  };
}
const generateDaysArray = (month, year) => {
  console.log('month', month, year);
  // Adjust month by subtracting 1 because month is 0-indexed in Date()
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = day;
    daysArray.push(`${date}`.padStart(2, '0')); // Adding leading zeros
  }

  return daysArray;
};
const generateYearsArray = lastYear => {
  const currentYear = new Date().getFullYear();
  const yearsArray = [];

  for (let year = lastYear; year <= currentYear; year++) {
    yearsArray.push(`${year}`);
  }

  return yearsArray;
};

const RnDateInputPicker = ({
  visible = false,
  closeModal = () => {},
  onSelected = () => {},
  lastYear = '1951',
  activeTextColor = '#000',
  btnColor = '#000',
  highlightBorderWidth = StyleSheet.hairlineWidth,
  defaultDate = logFormattedDate(new Date()).formattedDate,
}) => {
  const childRef = useRef(null);

  const [singelMonth, setSingelMonth] = useState();

  const [singelDate, setSingelDate] = useState();
  const [singelYear, setSingelYear] = useState();

  const [totalDateInMonth, setTotalDateInMonth] = useState([]);
  const [totalYear, setTotalYear] = useState([]);

  useEffect(() => {
    setSingelMonth(logFormattedDate(defaultDate).month);
    setSingelDate(logFormattedDate(defaultDate).day);
    setSingelYear(logFormattedDate(defaultDate).year);
    const allNewArray = generateYearsArray(lastYear);
    setTotalYear(allNewArray);
  }, [defaultDate, lastYear]);

  useEffect(() => {
    const daysArray = generateDaysArray(singelMonth - 1, singelYear);
    setTotalDateInMonth(daysArray);
  }, [singelYear, singelMonth]);

  const giveMeIndex = type => {
    if (type == 'date') {
      const newIndex = totalDateInMonth.findIndex(
        item => item === logFormattedDate(defaultDate).day,
      );
      return newIndex;
    } else {
      const newIndex = totalYear.findIndex(
        item => item == logFormattedDate(defaultDate).year,
      );
      return newIndex;
    }
  };

  const closeDateModal = () => {
    closeModal();
  };

  const handlePress = () => {
    Keyboard.dismiss();
    if (childRef.current) {
      childRef.current.triggerSubmit();
    }
  };

  const confrimDate = () => {
    onSelected({
      date: new Date(`${singelYear}-${singelMonth}-${singelDate}`),
      day: singelDate,
      month: singelMonth,
      year: singelYear,
    });
    closeModal();
  };

  return (
    <View style={styles.modalCenterView}>
      <View style={styles.dateContiner}>
        {/* // months // */}
        <Gradiant />

        {/* // Year // */}
        <View style={{height: 380, width: '100%'}}>
          <SingelDatePicker
            ref={childRef}
            onValueChange={(data, selectedIndex) => {
              if (data !== null) {
                setSingelYear(String(data));
              }
            }}
            keyboardType={'number-pad'}
            selectedIndex={giveMeIndex('year')}
            style={{height: 400}}
            activeTextColor={activeTextColor}
            itemHeight={100}
            highlightBorderWidth={highlightBorderWidth}
            dataSource={totalYear}
          />
        </View>
      </View>
    </View>
  );
};

export default RnDateInputPicker;
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenterView: {
    pointerEvents: 'box-none',
    width: '100%',
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
  dateContiner: {},
});
