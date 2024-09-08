import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Gradiant = () => {
  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.6)']} // White to trans
        // colors={['red', 'rgba(255,255,255,0.6)']} // White to transparent
        style={styles.gradientBootom}
      />
      <LinearGradient
        // colors={['red', 'rgba(255,255,255,0.9)']} // Corrected the closing bracket
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)']} // Corrected the closing bracket
        style={styles.gradientTop}
      />
    </View>
  );
};

export default Gradiant;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: 'none',
  },
  gradientBootom: {
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,

    transform: 'rotate(180deg)',
  },
  gradientTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 50,
  },
});
