import jwt_decode from 'jwt-decode';

export const receiveDataFromQrCode = async data => {
  try {
    const {opn} = await jwt_decode(data);

    if (opn) {
      return opn;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
