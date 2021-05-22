import React, {useEffect} from 'react';
import TickIcon from '../assets/tick.svg';
import dayjs from 'dayjs';

import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Success = ({lastCheckIn, venue, setVenue, setModalVisible}) => {
  useEffect(() => {
    return () => {
      setVenue(null);
    };
  }, [setVenue]);

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <TickIcon style={styles.tick} width={100} height={100} />
        <Text style={[styles.text, {fontSize: 30, fontWeight: 'bold'}]}>
          Thank you for checking in to {lastCheckIn?.venue || venue}
        </Text>
        <Text style={[styles.text, {fontWeight: 'bold'}]}>
          {lastCheckIn
            ? dayjs(lastCheckIn?.time).format('DD MMM YYYY, HH:mm')
            : dayjs(new Date()).format('DD MMM YYYY, HH:mm')}
        </Text>
        <Text style={[styles.text, {fontSize: 20}]}>
          The app is the fastest way to be alerted of potential exposure to
          coronavirus at a venue.
        </Text>
        <View style={{flex: 1}} />
        <Text
          onPress={() => {
            setVenue && setVenue(null);
            setModalVisible(false);
          }}
          style={[
            styles.text,
            {fontSize: 16, color: '#0072ce', fontWeight: 'bold'},
          ]}>
          Wrong check-in? Tap to cancel.
        </Text>
        <View style={{flex: 1}} />
        <TouchableOpacity
          onPress={() => {
            setVenue && setVenue(null);
            setModalVisible(false);
          }}
          width="80%"
          style={styles.button}>
          <Text style={styles.buttonText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: -1,
    alignContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
  },
  closeButton: {
    zIndex: 10,
    position: 'absolute',
    top: 10,
    height: 50,
  },
  tick: {alignSelf: 'center', marginTop: '50%', marginBottom: 10},
  textWrapper: {textAlign: 'center', padding: 20},
  text: {
    zIndex: 5,
    color: 'black',
    fontSize: 25,
    paddingLeft: 10,
    paddingRight: 10,
    position: 'relative',
    margin: 'auto',
    marginTop: 15,
    textAlign: 'center',
  },
  button: {
    zIndex: 5,
    minWidth: '80%',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 40,
    margin: 'auto',
    backgroundColor: '#0070cc',
    opacity: 1,
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Success;
