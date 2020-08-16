var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id,tothis, code, width, height) {
	barcode.code128(wx.createCanvasContext(id,tothis), code, convert_length(width), convert_length(height))
}

function qrc(id, tothis,code, width, height) {
	qrcode.api.draw(code, {
		ctx: wx.createCanvasContext(id,tothis),
		width: convert_length(width),
		height: convert_length(height)
	})
}

module.exports = {
	barcode: barc,
	qrcode: qrc
}