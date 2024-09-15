import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const numberOfCards = 50;
const _size = 120;
const _cardSize = {
  width: _size,
  height: _size * 1.6,
  borderRadius: 12,
};

const cards = [...Array(numberOfCards).keys()].map(i => ({
  key: `cards-${i}`,
  uri: '../../assets/background.jpg',
}));

const TCards = ({card, index, topIndex}) => {
  // Shared value to animate card appearance
  const mounted = useSharedValue(0);

  useEffect(() => {
    mounted.value = withDelay(500, withTiming(1, {duration: 1000}));
  }, []);

  const stylez = useAnimatedStyle(() => {
    return {
      opacity: mounted.value, // Fade in animation
      // transform: [
      //   {scale: mounted.value}, // Scale up animation
      //   {translateY: mounted.value * 20}, // Slide up animation
      // ],

      zIndex: topIndex === index ? 1 : 0, // Ensure top card is on top
    };
  });

  return (
    <Animated.View
      key={index}
      style={[
        styles.cardContainer,
        stylez,
        {left: (index * _cardSize.width) / 1.5},
      ]}>
      <TouchableOpacity onPress={() => console.log('Card pressed:', card.key)}>
        <Text>{card.key}</Text>
        <Image
          style={[
            styles.cardImage,
            // {width: topIndex === index ? 100 : _cardSize.width},
          ]}
          source={require(`../../assets/background.jpg`)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const TarotWhile = ({cards}) => {
  const scrollOffsetX = useRef(0); // Store scroll position
  const scrollTimeout = useRef(null);
  const [allCards, setAllCards] = useState([...cards]);
  const [centerIndex, setCenterIndex] = useState(Math.floor(cards.length / 2));

  // Assuming cards are in an array and topIndex is passed to TCards
  const topIndex = Math.floor(cards.length / 2); // Example for middle card
  const handleScrollEnd = () => {
    console.log('Scrolling has ended');
    setAllCards([...allCards, ...cards]);
    // Add any logic you want to execute when scrolling ends
  };

  const handleScroll = event => {
    scrollOffsetX.current = event.nativeEvent.contentOffset.x;
    const cardWidth = _cardSize.width / 1.5;
    const newCenterIndex = Math.floor(
      (scrollOffsetX.current + width / 2) / cardWidth,
    );
    setCenterIndex(newCenterIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        snapToInterval={_cardSize.width / 2}>
        <View
          style={[
            styles.cardStack,
            {width: allCards.length * (_cardSize.width / 2)},
          ]}>
          {allCards.map((card, index) => (
            <TCards
              key={index}
              card={card}
              index={index}
              topIndex={centerIndex}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const TarotsCards = () => {
  return (
    <View style={styles.containerx}>
      <TarotWhile cards={cards} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerx: {
    flex: 1,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    // width: width,
    // alignItems: 'center',
  },
  cardStack: {
    flexDirection: 'row',
    backgroundColor: 'red',
    position: 'relative',
  },
  cardContainer: {
    position: 'absolute',
    width: _cardSize.width,
    height: _cardSize.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: _cardSize.width,
    height: _cardSize.height,
    borderRadius: _cardSize.borderRadius,
    borderWidth: 1,
    borderColor: '#fff',
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
});

export default TarotsCards;
