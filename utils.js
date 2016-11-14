//Global utils

function toggleFullScreen() {
    document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ? document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen() : document.documentElement.requestFullscreen ? document.documentElement.requestFullscreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullscreen && document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
}

function getRandomColor() {
    for (var a = "0123456789ABCDEF".split(""), b = "#", c = 0; 6 > c; c++)
        b += a[Math.floor(16 * Math.random())];
    return b
}

function getRandomArbitrary(a, b) {
    return Math.random() * (b - a) + a
}