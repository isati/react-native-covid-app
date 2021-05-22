import React from 'react';
import TelegramIcon from '../assets/telegram.svg';
import GitHubIcon from '../assets/github.svg';
import SickEarth from '../assets/sickearth.svg';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import Unorderedlist from 'react-native-unordered-list';

const About = ({navigation}) => {
  return (
    <View style={styles.container}>
      <SickEarth width="50%" />
      <View style={styles.textWrapper}>
        <Unorderedlist>
          <Text style={styles.text}>Does not collect or send any data</Text>
        </Unorderedlist>
        <Unorderedlist>
          <Text style={styles.text}>Can be used offline</Text>
        </Unorderedlist>
        <Text style={styles.text}>
          Join the{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://t.me/covid1984app')}>
            Telegram chat
          </Text>{' '}
          for updates, support, discussion, donations, etc..
        </Text>

        <Text style={styles.text}>
          Check out the{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https:/cv1984.xyz')}>
            webapp version
          </Text>{' '}
          for browsers and iPhone.
        </Text>

        <View style={styles.iconButtons}>
          <TelegramIcon
            onPress={() => Linking.openURL('https://t.me/covid1984app')}
            height={30}
            width={30}
          />

          <GitHubIcon
            onPress={() =>
              Linking.openURL('https://github.com/isati/react-covid-app')
            }
            height={30}
            width={30}
          />
        </View>

        <Text style={styles.text}>
          Made with ❤️ by{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://sick.earth')}>
            sick.earth
          </Text>
        </Text>

        <Text style={[styles.text, styles.version]}>0.4.2</Text>
        <TouchableOpacity
          onPress={navigation.goBack}
          width="80%"
          style={styles.button}>
          <Text style={styles.buttonText}>Go back</Text>
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
    backgroundColor: 'black',
    alignItems: 'center',
    textAlign: 'center',
  },

  textWrapper: {textAlign: 'center'},
  text: {
    zIndex: 5,
    color: 'white',
    fontSize: 16,
    paddingLeft: 50,
    paddingRight: 50,
    position: 'relative',
    margin: 'auto',
    marginTop: 20,
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
  iconButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'space-evenly',
  },
  link: {
    color: '#0070cc',
  },
  version: {
    opacity: 0.5,
  },
});

export default About;
