var liveUrl = "http://127.0.0.1:8079/live/test.m3u8";
var dplayerUrl = "http://" + location.hostname + ":" + location.port + "/";
var wsUrl = "ws://" + location.hostname + ":" + location.port + "/websocket/init";

$(function () {
  var ws = new Websocket(wsUrl, function (event) {
    var data = event.data;
    var danmu;
    try {
      danmu = JSON.parse(data).commandData;
    } catch (e) {
      danmu = null;
    }
    if (danmu) {
      setDanmu(danmu);
    }
  })

  const dp = new DPlayer({
    container: document.getElementById('dplayer'),
    live: true,
    danmaku: {
      id: "xanderye",
      api: dplayerUrl
    },
    video: {
      url: liveUrl,
      type: "hls",
      pic: '../img/xander.png',
      thumbnails: '../img/xander.png',
    },
    apiBackend: {
      read: function (option, callback) {
        if (callback) {
          callback();
        }
      },
      send: function (option, callback) {
        ws.send(2, option.data);
        if (callback) {
          callback();
        }
        $(".dplayer-comment-input").val("");
      },
    },
  });

  function setDanmu(danmu) {
    var type = "right";
    switch (danmu.type) {
      case 1:
        type = "top";
        break;
      case 2:
        type = "bottom";
        break;
      default:
        break;
    }
    dp.danmaku.draw({
      text: danmu.text,
      color: danmu.color,
      type: type,
    });
  }

})
