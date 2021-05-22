import React from 'react';
import CrossIcon from '../assets/cross.svg';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Failure = ({setModalVisible}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <View>
          <CrossIcon style={styles.tick} width={100} height={100} />
          <Text style={[styles.text, styles.header]}>
            QR code not recognised
          </Text>

          <Text style={styles.text}>
            It could be that you didn't scan an official NHS QR code or the code
            is damaged.
          </Text>
          <Text style={styles.link}>Help with venue check-in</Text>
          <Text style={styles.text}>
            You may be trying to scan an invalid official NHS QR code or maybe
            this venue isn't recognised.
          </Text>
          <Text style={styles.text}>
            Please find another way to check in. Speak to a member of staff for
            help.
          </Text>
        </View>
        <View style={{flexGrow: 1}} />
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
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
    justifyContent: 'flex-start',
    zIndex: -1,
    alignContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    textAlign: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  tick: {alignSelf: 'center'},
  textWrapper: {
    marginTop: 50,
    textAlign: 'center',
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  text: {
    zIndex: 5,
    color: 'black',
    fontSize: 18,
    paddingLeft: 35,
    paddingRight: 35,
    position: 'relative',
    margin: 'auto',
    marginTop: 30,
    textAlign: 'center',
  },
  button: {
    zIndex: 5,
    minWidth: '80%',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 25,
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
  link: {
    color: '#0070cc',
    textAlign: 'center',
    margin: 15,
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default Failure;
