import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Modal, Alert} from 'react-native';
import Success from './Success';

const TextInputForm = ({setLastCheckIn}) => {
  const [venue, setVenue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Venue name</Text>
      <TextInput
        autoFocus={true}
        value={venue}
        onChangeText={setVenue}
        onSubmitEditing={() => {
          if (!venue) {
            return Alert.alert('Required', 'Please enter a venue', [
              {
                text: 'Ok',
                style: 'cancel',
              },
            ]);
          }
          setModalVisible(true);
          setLastCheckIn({venue, time: new Date()});
        }}
        style={styles.input}
      />

      <Modal
        animationType="slide"
        statusBarTranslucent
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setVenue(null);
          setModalVisible(false);
        }}>
        {venue && (
          <Success
            setVenue={setVenue}
            setModalVisible={setModalVisible}
            venue={venue}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingBottom: '50%',
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: -1,
    alignContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    textAlign: 'center',
  },

  textWrapper: {marginTop: 200, textAlign: 'center'},
  text: {
    zIndex: 5,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    paddingLeft: 50,
    paddingRight: 50,
    position: 'relative',
    margin: 'auto',
    textAlign: 'center',
  },
  button: {
    zIndex: 5,
    minWidth: '80%',
    width: '80%',
    alignSelf: 'center',
    marginTop: 40,
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
  input: {
    width: '60%',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    color: 'white',
  },
});

export default TextInputForm;
