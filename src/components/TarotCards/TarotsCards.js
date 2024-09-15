import React, {useEffect} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
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

const TWO_PI = Math.PI * 2;
const theta = TWO_PI / numberOfCards;
const cardVisibilityPercentage = 0.7;
const cardSize = _cardSize.width * cardVisibilityPercentage;
const circleRadius = Math.max(
  (cardSize * numberOfCards) / (2 * Math.PI),
  width,
);
const circleCircumPerence = TWO_PI * circleRadius;
const changeFector = circleCircumPerence / width;

const TCards = ({card, index, interpolatedIndex}) => {
  // Remove `keys` from props
  const mounted = useSharedValue(0);
  useEffect(() => {
    mounted.value = withDelay(500, withTiming(1, {duration: 1000}));
  }, []);

  const stylez = useAnimatedStyle(() => {
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
            [0, -_cardSize.height / 2, 0],
            Extrapolation.CLAMP,
          ),
        },
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
          // transform: [
          //   {
          //     rotate: `${theta * index}rad`,
          //   },
          // ],
        },
        stylez,
      ]}>
      <Image
        style={{
          width: _cardSize.width,
          height: _cardSize.height,
          borderRadius: _cardSize.borderRadius,
          borderWidth: 2,
          borderColor: '#fff',
        }}
        source={require(`../../assets/background.jpg`)}
      />
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
      distance.value += ev.changeX * changeFector;
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
            top: height - _cardSize.height * 1.5,
          },
          stylez,
        ]}>
        {cards.map((card, index) => {
          return (
            <TCards
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
          flex: 1,
          backgroundColor: 'blue',
        }}>
        <TarotWhile cards={cards} />
      </View>
    </GestureHandlerRootView>
  );
};

export default TarotsCards;
