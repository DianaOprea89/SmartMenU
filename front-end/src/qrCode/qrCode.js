const QRCode = require('qrcode');

const generateQR = async text => {
    try {
        console.log(await QRCode.toDataURL(text));
    } catch (err) {
        console.error(err);
    }
};

// Call the function with your URL
generateQR('http://localhost:8080/restaurant/Time%20Place%20Kitchen%20I%20Bar/accessRestaurant');
