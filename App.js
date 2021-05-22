import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  StatusBar,
  NativeModules,
  Modal,
  ToastAndroid,
} from 'react-native';
import Success from './src/components/Success';
import BackgroundColor from 'react-native-background-color';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';
import CameraIcon from './src/assets/camera.svg';
import Scanner from './src/components/Scanner';
import About from './src/components/About';
import TextInput from './src/components/TextInput';
import TextInputIcon from './src/assets/textinput.svg';
import ScannerIcon from './src/assets/scanner.svg';
import FavouriteIcon from './src/assets/favorite.svg';
import InfoIcon from './src/assets/info.svg';
import ShareIcon from './src/assets/share.svg';
import HistoryIcon from './src/assets/history.svg';
import DeleteIcon from './src/assets/delete.svg';
import ExitIcon from './src/assets/exit.svg';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {RNCamera} from 'react-native-camera';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import TorchIcon from './src/assets/torch.svg';
import {Divider} from 'react-native-elements';
import RNExitApp from 'react-native-exit-app';

const Drawer = createDrawerNavigator();

const {ShareAppModule} = NativeModules;

const types = {
  0: 'back',
  1: 'front',
};

const App = () => {
  const navigationRef = useRef();
  const [state, setState] = useState({
    cameraId: null,
    cameraIds: null,
    savedCamera: null,
    loading: true,
    lastCheckIn: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    BackgroundColor.setColor('#000000');
    handlePermission();
    getDefaultCamera();
    getLastCheckIn();
    setTimeout(() => {
      SplashScreen.hide();
    }, 800);
  }, []);

  const setSavedCamera = async id => {
    try {
      await AsyncStorage.setItem('savedCamera', id.id);
      setState(prevState => ({...prevState, savedCamera: id.id}));
      ToastAndroid.show(
        `Saved camera ${id.id} (${types[id.type]}) as default`,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      // Error saving data
    }
  };

  const setLastCheckIn = async lastCheckIn => {
    try {
      await AsyncStorage.setItem('lastCheckIn', JSON.stringify(lastCheckIn));
      setState(prevState => ({
        ...prevState,
        lastCheckIn,
      }));
    } catch (error) {
      // Error saving data
    }
  };

  const deleteLastCheckIn = async () => {
    try {
      await AsyncStorage.removeItem('lastCheckIn');
      setState(prevState => ({...prevState, lastCheckIn: null}));
      ToastAndroid.show('Deleted last check-in', ToastAndroid.SHORT);
    } catch (error) {
      // Error saving data
    }
  };

  const setCamera = id => {
    setState(prevState => ({...prevState, cameraId: id}));
  };

  const handleShareApp = async () => {
    ShareAppModule.ShareApp();
  };

  const getDefaultCamera = async () => {
    try {
      const id = await AsyncStorage.getItem('savedCamera');
      if (id !== null) {
        // We have data!!
        setState(prevState => ({
          ...prevState,
          cameraId: id,
          savedCamera: id,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLastCheckIn = async () => {
    try {
      const lastCheckIn = JSON.parse(await AsyncStorage.getItem('lastCheckIn'));
      if (lastCheckIn !== null) {
        // We have data!!
        setState(prevState => ({
          ...prevState,
          lastCheckIn,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFlashMode = async () => {
    if (flashMode === RNCamera.Constants.FlashMode.off) {
      setFlashMode(RNCamera.Constants.FlashMode.torch);
    }

    if (flashMode === RNCamera.Constants.FlashMode.torch) {
      setFlashMode(RNCamera.Constants.FlashMode.off);
    }
  };

  const handlePermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      setState(prevState => ({
        ...prevState,
        hasPermission: true,
        loading: false,
      }));
    } else {
      console.log('Camera permission denied');
    }
  };

  const {
    lastCheckIn,
    hasPermission,
    cameraId,
    cameraIds,
    savedCamera,
    loading,
  } = state;

  const CustomDrawerContent = props => {
    const {navigation} = props;
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          labelStyle={[styles.labelStyle, {fontWeight: 'bold'}]}
          label="Camera select"
          icon={({focused, color, size}) => (
            <CameraIcon color={color} height={20} width={20} />
          )}
        />

        {cameraIds?.map(id => (
          <DrawerItem
            key={id.id}
            labelStyle={[
              styles.labelStyle,
              cameraId !== id.id && {opacity: 0.5},
            ]}
            onPress={() => {
              setCamera(id.id);
              navigation.navigate('Scanner');
              navigation.closeDrawer();
            }}
            label={`Camera ${id.id} (${types[id.type]})`}
            icon={({focused, color, size}) => (
              <TouchableOpacity
                onPress={() => {
                  setSavedCamera(id);
                  setCamera(id.id);
                }}>
                <FavouriteIcon
                  color={savedCamera === id.id ? 'orange' : 'grey'}
                  height={20}
                  width={20}
                />
              </TouchableOpacity>
            )}
          />
        ))}
        <View style={{flex: 1}} />

        {lastCheckIn && (
          <>
            <DrawerItem
              onPress={() => setModalVisible(true)}
              labelStyle={styles.labelStyle}
              label={`Last check-in`}
              icon={({focused, color, size}) => (
                <>
                  <HistoryIcon height={20} width={20} />
                  <DeleteIcon
                    onPress={deleteLastCheckIn}
                    height={20}
                    style={{
                      alignSelf: 'center',
                      position: 'absolute',
                      right: 0,
                    }}
                  />
                </>
              )}
            />
            <Divider
              style={{
                height: 1,
                backgroundColor: '#e1e8ee',
                opacity: 0.5,
                width: '75%',
                alignSelf: 'flex-end',
              }}
            />
          </>
        )}

        <DrawerItem
          onPress={() => navigation.navigate('Scanner')}
          labelStyle={styles.labelStyle}
          label="Scanner"
          icon={({focused, color, size}) => (
            <ScannerIcon color={color} height={20} width={20} />
          )}
        />
        <DrawerItem
          onPress={() => navigation.navigate('Text Input')}
          labelStyle={styles.labelStyle}
          label="Text Input"
          icon={({focused, color, size}) => (
            <TextInputIcon color={color} height={20} width={20} />
          )}
        />
        {screen === 'Scanner' && (
          <DrawerItem
            onPress={handleFlashMode}
            labelStyle={[styles.labelStyle]}
            label="Torch"
            icon={({focused, color, size}) => (
              <TorchIcon color={color} height={20} width={20} />
            )}
          />
        )}

        <DrawerItem
          onPress={handleShareApp}
          labelStyle={styles.labelStyle}
          label="Share"
          icon={({focused, color, size}) => (
            <ShareIcon color={color} height={20} width={20} />
          )}
        />
        <DrawerItem
          onPress={() => navigation.navigate('About')}
          labelStyle={styles.labelStyle}
          label="About"
          icon={({focused, color, size}) => (
            <InfoIcon color={color} height={20} width={20} />
          )}
        />
        <DrawerItem
          onPress={() => RNExitApp.exitApp()}
          labelStyle={styles.labelStyle}
          label="Exit"
          icon={({focused, color, size}) => (
            <ExitIcon color={color} height={20} width={20} />
          )}
        />
      </DrawerContentScrollView>
    );
  };

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'black',
    },
  };

  if (!loading) {
    return (
      <NavigationContainer
        onStateChange={() => {
          setScreen(navigationRef.current.getCurrentRoute().name);
        }}
        onReady={() => setScreen(navigationRef.current.getCurrentRoute().name)}
        ref={navigationRef}
        theme={MyTheme}>
        <StatusBar backgroundColor="#0070cc" />
        <Drawer.Navigator
          edgeWidth={50}
          drawerContent={CustomDrawerContent}
          drawerType="back"
          sceneContainerStyle={{color: 'black'}}
          drawerContentOptions={{
            inactiveTintColor: 'white',
            labelStyle: {
              color: 'white',
            },
            contentContainerStyle: {
              height: '100%',
              bottom: 0,
              color: 'white',
            },
          }}
          drawerStyle={styles.drawerStyle}
          initialRouteName="Scanner">
          <Drawer.Screen name="Scanner">
            {props => (
              <Scanner
                cameraId={cameraId}
                savedCamera={savedCamera}
                setState={setState}
                hasPermission={hasPermission}
                flashMode={flashMode}
                setLastCheckIn={setLastCheckIn}
                {...props}
              />
            )}
          </Drawer.Screen>

          <Drawer.Screen name="Text Input">
            {props => <TextInput setLastCheckIn={setLastCheckIn} {...props} />}
          </Drawer.Screen>

          <Drawer.Screen name="About" component={About} />
        </Drawer.Navigator>
        <Modal
          animationType="slide"
          statusBarTranslucent
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <Success
            setModalVisible={setModalVisible}
            lastCheckIn={lastCheckIn}
          />
        </Modal>
      </NavigationContainer>
    );
  }

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  labelStyle: {
    color: 'white',
    textAlign: 'left',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  drawerStyle: {
    bottom: 0,
    height: '100%',
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    color: 'white',
  },
});

export default App;
