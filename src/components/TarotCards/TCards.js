import React, {useEffect} from 'react';
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
const _size = 100;
const _cardSize = {
  width: _size,
  height: _size * 1.6,
  borderRadius: 12,
};

const cards = [...Array(numberOfCards).keys()].map(i => ({
  key: `cards-${i}`,
  uri: '../../assets/background.jpg',
}));

const TCards = ({card, index}) => {
  // Shared value to animate card appearance
  const mounted = useSharedValue(0);

  useEffect(() => {
    mounted.value = withDelay(500, withTiming(1, {duration: 1000}));
  }, []);

  const stylez = useAnimatedStyle(() => {
    return {
      opacity: mounted.value, // Fade in animation
      transform: [
        {scale: mounted.value}, // Scale up animation
        {translateY: mounted.value * 20}, // Slide up animation
      ],
      // zIndex: topIndex === index ? 1 : 0, // Ensure top card is on top
    };
  });

  return (
    <Animated.View style={[styles.cardContainer, stylez, {left: index * 40}]}>
      <TouchableOpacity onPress={() => console.log('Card pressed:', index)}>
        <Text>{card.key}</Text>
        <Image
          style={styles.cardImage}
          source={require(`../../assets/background.jpg`)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const TarotWhile = ({cards}) => {
  // Assuming cards are in an array and topIndex is passed to TCards
  const topIndex = Math.floor(cards.length / 2); // Example for middle card

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.scrollViewContent}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.cardStack}>
          {cards.map((card, index) => (
            <TCards
              key={card.key}
              card={card}
              index={index}
              // topIndex={topIndex}
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
    // alignItems: 'center',
  },
  cardStack: {
    flexDirection: 'row',
    backgroundColor: 'red',
    width: width * numberOfCards, // Adjust width as needed for scrolling
    height: _cardSize.height,
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
    borderWidth: 2,
    borderColor: '#fff',
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
});

export default TarotsCards;
