import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function isNumeric(str) {
  if (typeof str === 'number') return true;
  if (typeof str !== 'string') return false;
  return (
    !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  );
}

const deviceWidth = Dimensions.get('window').width;

const isViewStyle = style => {
  return (
    typeof style === 'object' &&
    style !== null &&
    Object.keys(style).includes('height')
  );
};

const SingelMonthPicker = forwardRef((props, ref) => {
  const {
    itemHeight = 30,
    style,
    scrollViewComponent,
    dataSource,
    selectedIndex: propSelectedIndex,
    onValueChange,
    renderItem,
    highlightColor = '#333', // Default value
    highlightBorderWidth = StyleSheet.hairlineWidth, // Default value
    itemTextStyle,
    activeItemTextStyle,
    wrapperHeight: propWrapperHeight,
  } = props;

  const [initialized, setInitialized] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    propSelectedIndex && propSelectedIndex >= 0 ? propSelectedIndex : 0,
  );
  // const [dataSourcess, setDataSource] = useState(dataSource); // Track the data source state
  const [selectedValue, setSelectedValue] = useState(dataSource[selectedIndex]); // Track the current selected value
  const [suggestArray, setSuggestArry] = useState([]);
  const sView = useRef(null);
  const [isScrollTo, setIsScrollTo] = useState(false);
  const [dragStarted, setDragStarted] = useState(false);
  const [momentumStarted, setMomentumStarted] = useState(false);
  const [timer, setTimer] = useState(null);

  useImperativeHandle(ref, () => ({
    scrollToTargetIndex: val => {
      setSelectedIndex(val);
      sView.current?.scrollTo({y: val * itemHeight});
    },
  }));

  const wrapperHeight =
    propWrapperHeight ||
    (isViewStyle(style) && isNumeric(style.height)
      ? Number(style.height)
      : 0) ||
    itemHeight * 5;

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    setTimeout(() => {
      const y = itemHeight * selectedIndex;
      sView.current?.scrollTo({y: y});
    }, 0);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [initialized, itemHeight, selectedIndex, timer]);

  const renderPlaceHolder = () => {
    const h = (wrapperHeight - itemHeight) / 2;
    const header = <View style={{height: h, flex: 1}} />;
    const footer = <View style={{height: h, flex: 1}} />;
    return {header, footer};
  };

  const handleEditSubmit = () => {
    const sugArr = dataSource.filter(month =>
      month
        .toLowerCase()
        .startsWith(
          selectedValue.toLowerCase() == '' ? 'T' : selectedValue.toLowerCase(),
        ),
    );
    const newIndex = dataSource.findIndex(item => item === sugArr[0]);
    if (newIndex !== -1) {
      console.log('sugArr[0]', sugArr[0]);
      setSelectedValue(sugArr[0]);
      setSelectedIndex(newIndex);
      onValueChange(sugArr[0], newIndex);
      setTimeout(() => {
        const y = itemHeight * newIndex;
        sView.current?.scrollTo({y: y});
      }, 0);
    } else {
      setTimeout(() => {
        const y = itemHeight * 0;
        sView.current?.scrollTo({y: y});
      }, 0);
      setSelectedValue(dataSource[0]);
      onValueChange(dataSource[0], 0);
      setSelectedIndex(0);
    }
  };
  const handleValueChange = text => {
    // for suggestArray

    const sugArr = dataSource.filter(month =>
      month
        .toLowerCase()
        .startsWith(text.toLowerCase() == '' ? 'T' : text.toLowerCase()),
    );
    const isValid = dataSource.some(number =>
      number.toLowerCase().startsWith(text.toLowerCase()),
    ); // If valid, update state; otherwise, do nothing
    if (isValid || text === '' || sugArr.length > 0) {
      const newIndex = dataSource.findIndex(item => item === sugArr[0]);
      if (newIndex !== -1) {
        onValueChange(sugArr[0], newIndex);
        setSuggestArry(sugArr);
      } else {
        setSuggestArry([]);
        onValueChange(0, -1);
      }

      setSelectedValue(text);
    } else {
      console.log('a');
    }
  };

  // '_un'; /// output

  const makeSpess = (a, b) => {
    let x = '';
    if (b?.length > 0) {
      for (let i = 0; i < b.length; i++) {
        if (i < a.length && a[i].toLowerCase() === b[i].toLowerCase()) {
          x += '_';
        } else {
          x += b[i];
        }
      }
    }

    return x;
  };

  // after onchnage find index and set call back
  const renderItemFn = (data, index) => {
    const isSelected = index === selectedIndex;

    const item = renderItem ? (
      renderItem(data, index, isSelected)
    ) : (
      <View style={{width: '100%'}}>
        {isSelected ? (
          <View
            style={{
              position: 'relative',
              marginLeft: 20,
              width: '100%',
            }}>
            <TextInput
              style={
                (activeItemTextStyle
                  ? activeItemTextStyle
                  : styles.activeItemTextStyle,
                {
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: 17,
                  color: '#fdba74',
                })
              }
              value={selectedValue} // Display the selected value
              onChangeText={handleValueChange} // Update value on change
              onSubmitEditing={handleEditSubmit}
            />
            <Text
              style={{
                top: '25%',
                left: 10,
                fontSize: 17,
                fontWeight: 'bold',
                color: '#e2e8f0',
                textTransform: 'capitalize',
                zIndex: -1,
                position: 'absolute',
              }}>
              {}
              {makeSpess(selectedValue, suggestArray[0])}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              itemTextStyle ? itemTextStyle : styles.itemTextStyle,
              {marginLeft: 20},
            ]}>
            {data}
          </Text>
        )}
      </View>
    );

    return (
      <View
        style={[styles.itemWrapper, {height: itemHeight, fontWeight: 'bold'}]}
        key={index}>
        {item}
      </View>
    );
  };

  const scrollFix = useCallback(
    e => {
      let y = 0;
      const h = itemHeight;
      if (e.nativeEvent.contentOffset) {
        y = e.nativeEvent.contentOffset.y;
      }
      const _selectedIndex = Math.round(y / h);
      // for suggestArray remove
      setSuggestArry([]);
      const _y = _selectedIndex * h;
      if (_y !== y) {
        if (Platform.OS === 'ios') {
          setIsScrollTo(true);
        }
        sView.current?.scrollTo({y: _y});
      }
      if (selectedIndex === _selectedIndex) {
        return;
      }
      if (onValueChange) {
        const selectedValue = dataSource[_selectedIndex];
        setSelectedIndex(_selectedIndex);
        onValueChange(selectedValue, _selectedIndex);
        setSelectedValue(selectedValue);
      }
    },
    [itemHeight, onValueChange, selectedIndex, dataSource],
  );

  const onScrollBeginDrag = () => {
    setDragStarted(true);

    if (Platform.OS === 'ios') {
      setIsScrollTo(false);
    }
    if (timer) clearTimeout(timer);
  };

  const onScrollEndDrag = e => {
    setDragStarted(false);

    const _e = {...e};
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (!momentumStarted) {
          scrollFix(_e);
        }
      }, 50),
    );
  };

  const onMomentumScrollBegin = () => {
    setMomentumStarted(true);
    if (timer) clearTimeout(timer);
  };

  const onMomentumScrollEnd = e => {
    setMomentumStarted(false);

    if (!isScrollTo && !dragStarted) {
      scrollFix(e);
    }
  };

  const {header, footer} = renderPlaceHolder();
  const highlightWidth = (isViewStyle(style) ? style.width : 0) || deviceWidth;

  const wrapperStyle = {
    height: wrapperHeight,
    flex: 1,
    overflow: 'hidden',
  };

  const highlightStyle = {
    position: 'absolute',
    top: (wrapperHeight - itemHeight) / 2,
    height: itemHeight,
    zInxex: -1,
    width: highlightWidth,
    borderTopColor: highlightColor,
    borderBottomColor: highlightColor,
    borderTopWidth: highlightBorderWidth,
    borderBottomWidth: highlightBorderWidth,
  };

  const CustomScrollViewComponent = scrollViewComponent || ScrollView;

  return (
    <View style={wrapperStyle}>
      <View style={highlightStyle} />
      <CustomScrollViewComponent
        ref={sView}
        bounces={false}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}>
        {header}
        {dataSource.map(renderItemFn)}
        {footer}
      </CustomScrollViewComponent>
    </View>
  );
});

export default SingelMonthPicker;

const styles = StyleSheet.create({
  itemWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextStyle: {
    color: '#999',
  },
  activeItemTextStyle: {
    color: '#333',
  },
});
