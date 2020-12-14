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
      addHistory(danmu);
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

  $("#danmuText").unbind().bind("keydown", function (event) {
    if (event.key === "Enter") {
      sendDanmu();
    }
  });

  $("#sendDanmu").unbind().bind("click", function () {
    sendDanmu();
  })

  function sendDanmu() {
    var text = $("#danmuText").val();
    if (!text) {
      alert("请输入弹幕");
      return;
    }
    dp.danmaku.send(
      {
        text: text,
        color: '#fff',
        type: 'right'
      }
    );
    $("#danmuText").val("");
  }

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

  function addHistory(danmu) {
    var text = $("<div>").text(danmu.text).html();
    var p = $("<p></p>");
    p.html(dateFormat(new Date()) + "　　:　　" + text);
    p.css("color", "#" + parseInt(danmu.color, 10).toString(16));
    $("#first-line").before(p);
  }

  function dateFormat(date) {
    var Y = date.getFullYear();
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return [Y, M, D].join("-") + " " + [H, m, s].join(":");
  }
})
