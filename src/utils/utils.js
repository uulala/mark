let isInWx = false
// if (wx && wx.setStorageSync) {
//     isInWx = true
// }

function saveFile(filePath, content, successCb, failCb) {
    wx.writeFile({
        filePath: filePath,
        data: content,
        success: function () {
            successCb && successCb();
        },
        fail: function (err) {
            failCb && failCb(err);
        }
    });
}

function readFile(filePath, successCb, failCb) {
    wx.readFile({
        filePath: filePath,
        encoding: 'utf-8',
        success: function (res) {
            successCb && successCb(res.data);
        },
        fail: function (err) {
            failCb && failCb(err);
        }
    });
}

function setStorageSync(key, value) {
    let newVal = value
    if (typeof value === 'object') {
        newVal = JSON.stringify(value)
    }
    uni.setStorageSync(key, newVal)
}
function getStorageSync(key) {
    return uni.getStorageSync(key)
}

export default {
    saveFile,
    readFile,
    setStorageSync,
    getStorageSync

}