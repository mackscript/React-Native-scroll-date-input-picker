import React, {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SingelDatePicker from './customDatePicker/SingelDatePicker';
import SingelMonthPicker from './customDatePicker/SingelMonthPicker';
import Gradiant from '../common/Gradiant';
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
// const generateDaysArray = (month, year) => {
//   const daysInMonth = new Date(year, month, 0).getDate();
//   const daysArray = [];

//   for (let day = 1; day <= daysInMonth; day++) {
//     const date = day;
//     daysArray.push(`${date}`.padStart(2, '0'));
//   }

//   return daysArray;
// };
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
  defaultDate = logFormattedDate(new Date()).formattedDate,
}) => {
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

  const confrimDate = () => {
    onSelected({
      date: new Date(`${singelYear}-${singelMonth}-${singelDate}`),
      day: singelDate,
      month: singelMonth,
      year: singelYear,
    });
    closeModal();
    // Alert.alert('Alert Title', `${singelDate}-${singelMonth}-${singelYear}`, [
    //   {
    //     text: 'Cancel',
    //     onPress: () => console.log('nice '),
    //     style: 'cancel',
    //   },
    //   {text: 'OK', onPress: () => closeModal()},
    // ]);
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
            <Gradiant />
            <View style={{height: 180, width: 80}}>
              <SingelMonthPicker
                onValueChange={(data, selectedIndex) => {
                  if (data !== null) {
                    setSingelMonth(String(selectedIndex + 1).padStart(2, '0'));
                  }
                }}
                selectedIndex={singelMonth - 1}
                style={{height: 20}}
                wrapperHeight={180}
                itemHeight={60}
                dataSource={shortMonthsArray}
              />
            </View>
            {/* // Dates // */}
            <View style={{height: 180, width: 80}}>
              <SingelDatePicker
                onValueChange={(data, selectedIndex) => {
                  if (data !== null) {
                    setSingelDate(String(data));
                  }
                }}
                selectedIndex={giveMeIndex('date')}
                style={{height: 20}}
                wrapperHeight={180}
                itemHeight={60}
                dataSource={totalDateInMonth}
              />
            </View>
            {/* // Year // */}
            <View style={{height: 180, width: 80}}>
              <SingelDatePicker
                onValueChange={(data, selectedIndex) => {
                  if (data !== null) {
                    setSingelYear(String(data));
                  }
                }}
                selectedIndex={giveMeIndex('year')}
                style={{height: 20}}
                wrapperHeight={180}
                itemHeight={60}
                dataSource={totalYear}
              />
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

export default RnDateInputPicker;
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
