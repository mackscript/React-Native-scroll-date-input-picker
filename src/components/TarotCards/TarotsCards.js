import React, {useEffect} from 'react';
import {View, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

const numberOfCards = 40;
const imageUrl = `https://c8.alamy.com/comp/2BEJT76/a-single-tarot-card-the-page-of-pentacles-used-for-fortune-telling-2BEJT76.jpg`;

const _size = 130;
const _cardSize = {
  width: _size,
  height: _size * 1.6,
  borderRadius: 12,
};

const cards = [...Array(numberOfCards).keys()].map(i => ({
  key: `cards-${i}`,
  uri: '../../assets/background.jpg',
}));

const TWO_PI = Math.PI * 2;
const theta = TWO_PI / numberOfCards;
const cardVisibilityPercentage = 0.7;
const cardSize = _cardSize.width * cardVisibilityPercentage;
const circleRadius = 600;
// const circleRadius = Math.max(
//   (cardSize * numberOfCards) / (2 * Math.PI),
//   width / 2,
// );
const circleCircumPerence = TWO_PI * circleRadius;
const changeFector = circleCircumPerence / width;

const TCards = ({card, index, interpolatedIndex, activeIndex}) => {
  // Remove `keys` from props
  const mounted = useSharedValue(0);
  useEffect(() => {
    mounted.value = withDelay(500, withTiming(1, {duration: 1000}));
  }, []);

  const stylez = useAnimatedStyle(() => {
    const distanceFromActive = Math.abs(interpolatedIndex.value - index);

    return {
      transform: [
        {
          // rotate: `${theta * index}rad`,
          rotate: `${interpolate(
            mounted.value,
            [0, 1],
            [0, theta * index],
          )}rad`,
        },
        {
          translateY: interpolate(
            interpolatedIndex.value,
            [index - 1, index, index + 1],
            [0, -_cardSize.height / 3, 0],
            Extrapolation.CLAMP,
          ),
        },
        // {
        //   translateY:
        //     distanceFromActive < 0.5
        //       ? -_cardSize.height / 5 // Only the active card will move up on Y-axis
        //       : 0, // Other cards won't move
        // },
      ],
      zIndex: distanceFromActive < 0.5 ? 1 : 0, // Only the active card will have zIndex 1
    };
  });
  const stylez2 = useAnimatedStyle(() => {
    const distanceFromActive = Math.abs(interpolatedIndex.value - index);

    return {
      borderWidth: distanceFromActive < 0.5 ? 2 : 1,
      width: distanceFromActive < 0.5 ? 140 : _cardSize.width,
      height: distanceFromActive < 0.5 ? 240 : _cardSize.height,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: distanceFromActive < 0.5 ? 0 : 0,
      transform: [
        // {
        //   translateY: interpolate(
        //     interpolatedIndex.value,
        //     [index - 1, index, index + 1],
        //     [0, -_cardSize.height / 3, 0],
        //     Extrapolation.CLAMP,
        //   ),
        // },
        // {
        //   translateY:
        //     distanceFromActive < 0.5
        //       ? -_cardSize.height / 5 // Only the active card will move up on Y-axis
        //       : 0, // Other cards won't move
        // },
      ],
    };
  });
  return (
    <Animated.View
      key={index}
      style={[
        {
          position: 'absolute',
          width: _cardSize.width,
          height: circleRadius * 2,
          // height: _cardSize.height,
          // transform: [
          //   {
          //     rotate: `${theta * index}rad`,
          //   },
          // ],
        },
        stylez,
      ]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => console.log('interpolatedIndex', index)}>
        <Text>{card.key}</Text>
        <Animated.Image
          style={[
            {
              borderRadius: _cardSize.borderRadius,
              borderWidth: 2,
              borderColor: '#fff',
            },
            stylez2,
          ]}
          source={require(`../../assets/background.jpg`)}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

function TarotWhile({cards}) {
  const distance = useSharedValue(0);
  const angel = useDerivedValue(() => {
    return distance.value / circleCircumPerence;
  });

  const interpolatedIndex = useDerivedValue(() => {
    const flotIndex = Math.abs((angel.value % TWO_PI) / theta);
    return angel.value < 0 ? flotIndex : numberOfCards - flotIndex;
  });
  const activeIndex = useDerivedValue(() => {
    return Math.round(interpolatedIndex.value);
  });

  const gesture = Gesture.Pan()
    .onChange(ev => {
      distance.value += ev.changeX * changeFector - 10;
    })
    .onFinalize(ev => {
      distance.value = withDecay({
        velocity: ev.velocityX * changeFector,
        velocityFactor: changeFector,
      });
    });

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${angel.value}rad`,
        },
      ],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            width: circleRadius * 2,
            height: circleRadius * 2,
            borderRadius: circleRadius,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: (height / _cardSize.height) * 20,
          },
          stylez,
        ]}>
        {cards.map((card, index) => {
          return (
            <TCards
              activeIndex={activeIndex}
              interpolatedIndex={interpolatedIndex}
              key={card.key}
              card={card}
              index={index}
            />
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
}

const TarotsCards = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          // flex: 1,
          position: 'relative',
          height: 700,
          overflow: 'hidden',
        }}>
        <TarotWhile cards={cards} />
      </View>
    </GestureHandlerRootView>
  );
};

export default TarotsCards;
