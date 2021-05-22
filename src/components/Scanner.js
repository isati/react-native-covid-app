import React, {PureComponent} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {RNHoleView} from 'react-native-hole-view';
import {receiveDataFromQrCode} from '../util/receiveDataFromQrCode';
import Success from './Success';
import Failure from './Failure';
import CloseIcon from '../assets/close.svg';
import QRCodeScanner from '../modules/react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const firstHole = {
  x: Dimensions.get('window').width / 20,
  y: 45,
  left: Dimensions.get('window').width / 2 - 25,
  right: 0,
  margin: 'auto',
  width: width / 1.1,
  height: height / 2.5,
  borderRadius: 10,
};

const INITIAL_STATE = {
  modalVisible: false,
  venue: null,
};

const BACK_TYPE = RNCamera.Constants.Type.back;

class QRScanner extends PureComponent {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  handleClearState = () => {
    this.setState(prevState => ({
      ...INITIAL_STATE,
      hasPermission: prevState.hasPermission,
    }));
  };

  setVenue = venue => {
    this.setState(prevState => ({
      ...prevState,
      venue: venue,
    }));
  };

  setModalVisible = value => {
    this.setState(prevState => ({...prevState, modalVisible: value}));
  };

  handleBarCodeScanned = async ({data}) => {
    if (data && data.startsWith('UKC19TRACING:')) {
      const venue = await receiveDataFromQrCode(data);
      if (venue) {
        this.setState(prevState => ({
          ...prevState,
          venue,
          modalVisible: true,
        }));
        this.props.setLastCheckIn({venue, time: new Date()});
      }
    } else {
      this.setState(prevState => ({
        ...prevState,
        venue: null,
        modalVisible: true,
      }));
    }
  };

  handleMenu = () => {
    this.setState(prevState => ({...prevState, menuOpen: !prevState.menuOpen}));
  };

  handleVenue = venue => {
    this.setState(prevState => ({
      ...prevState,
      venue,
      modalVisible: true,
    }));
  };

  onCameraStatusChange = s => {
    if (s.cameraStatus === 'READY') {
      const {setState, savedCamera} = this.props;
      this.setState({cameraReady: true}, async () => {
        let ids = [];
        let cameraId = null;

        // Query the list of available cameras, and set the first available back camera.
        // Also set the list of cameras so we can loop through all of them afterwards.
        try {
          ids = await this.camera.getCameraIdsAsync();

          if (ids.length) {
            cameraId = ids[0].id;

            // Search for the first available back camera
            for (let c of ids) {
              if (c.type === BACK_TYPE) {
                cameraId = c.id;
                break;
              }
            }
          }
        } catch (err) {
          console.error('Failed to get camera ids', err.message || err);
        }
        setState(prevState => ({
          ...prevState,
          cameraIds: ids,
          cameraId: savedCamera || cameraId,
        }));
      });
    } else {
      if (this.state.cameraReady) {
        this.setState(prevState => ({...prevState, cameraReady: false}));
      }
    }
  };

  render() {
    const {modalVisible, venue} = this.state;

    const {hasPermission, flashMode, navigation, cameraId} = this.props;

    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }

    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    return (
      <View>
        <QRCodeScanner
          reactivate
          cameraProps={{
            ref: ref => (this.camera = ref),
            cameraId: cameraId,
            onStatusChange: this.onCameraStatusChange,
            rectOfInterest: {x: 0, y: 0, width: 0.5, height: 1.0},
            cameraViewDimensions: {height: height, width: width},
            autoFocusPointOfInterest: {x: 0.5, y: 0.25},
            barCodeTypes: [RNCamera.Constants.BarCodeType.qr],
          }}
          vibrate={false}
          checkAndroid6Permissions
          onRead={this.handleBarCodeScanned}
          flashMode={flashMode}
        />
        <RNHoleView style={styles.overlay} holes={[firstHole]} />
        <TouchableOpacity
          style={styles.closeButtonWrapper}
          onPress={() => navigation.toggleDrawer()}>
          <View width={20}>
            <CloseIcon style={styles.closeButton} width={25} height={25} />
          </View>
        </TouchableOpacity>
        <View style={styles.textWrapper}>
          <Text style={[styles.text, {marginBottom: '5%'}]}>
            Scan an official NHS QR code to check in
          </Text>
          <Text style={[styles.text, {fontSize: 18}]}>
            How it helps us stay safe
          </Text>
          <Text style={[styles.text, {fontSize: 16, fontWeight: 'normal'}]}>
            Checking in helps notify people who might have been exposed to
            coronavirus (COVID-19) at a venue they visited.
          </Text>

          <Text style={[styles.text, {fontSize: 16, fontWeight: 'normal'}]}>
            Nobody will know the notification is linked to you.
          </Text>
        </View>

        <Modal
          animationType="slide"
          statusBarTranslucent
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            this.setState(prevState => ({
              ...prevState,
              modalVisible: false,
            }));
          }}>
          {venue && (
            <Success
              setVenue={this.setVenue}
              setModalVisible={this.setModalVisible}
              venue={venue}
            />
          )}
          {!venue && <Failure setModalVisible={this.setModalVisible} />}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  closeButtonWrapper: {
    marginTop: 12,
    alignSelf: 'flex-start',
    zIndex: 5000,
    width: 50,
  },
  closeButton: {
    zIndex: 4000,
    marginTop: '2%',
    marginBottom: '2%',
    left: 20,
  },
  textWrapper: {top: '40%', marginTop: 10, height: '100%'},
  text: {
    zIndex: 5,
    color: 'white',
    fontSize: 24,
    paddingLeft: 50,
    paddingRight: 50,
    fontWeight: 'bold',
    position: 'relative',
    margin: 'auto',
    marginTop: '5%',
    textAlign: 'center',
  },
  button: {
    zIndex: 5,
    width: '40%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    margin: 'auto',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 1,
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    bottom: 0,
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default QRScanner;
