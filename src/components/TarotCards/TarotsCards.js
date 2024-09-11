import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import Carousel, {Pagination} from './src/index';

export default class TarotsCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: [
        {
          title: 'Item 1',
          text: 'Text 1',
        },
        {
          title: 'Item 2',
          text: 'Text 2',
        },
        {
          title: 'Item 3',
          text: 'Text 3',
        },
        {
          title: 'Item 4',
          text: 'Text 4',
        },
        {
          title: 'Item 5',
          text: 'Text 5',
        },
      ],
    };
  }

  _renderItem({item, index}) {
    return (
      <View
        style={{
          backgroundColor: 'floralwhite',
          borderRadius: 5,
          height: 250,
          padding: 50,
          marginLeft: 25,
          marginRight: 25,
        }}>
        <Text style={{fontSize: 30}}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  }
  // https://github.com/meliorence/react-native-snap-carousel
  render() {
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'rebeccapurple', paddingTop: 50}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.carouselItems}
            renderItem={this._renderItem}
            sliderWidth={300}
            itemWidth={300}
            loop={true}
            layout={'default'}
          />
        </View>
      </SafeAreaView>
    );
  }
}
