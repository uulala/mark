export default {
    showTip(msg, type = "success") {
        wx.showToast({
            title: msg,
            icon: type,
            duration: 800
        })
    }
}