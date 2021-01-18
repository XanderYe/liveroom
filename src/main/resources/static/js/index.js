$(function () {

  var urlKey = getUrlParam("key");
  var urlUsername = getUrlParam("username");
  if (urlKey) {
    key = urlKey;
  }
  if (urlUsername) {
    username = urlUsername;
  }
  liveUrl = liveUrl.replace("${key}", key);

  document.title = "性感" + username + "在线直播";
  $("#container h1").eq(0).text("欢迎来到" + username + "的直播间");


  var ws = new Websocket(wsUrl, function (event) {
    var data = event.data;
    var danmuData;
    try {
      danmuData = JSON.parse(data).commandData;
    } catch (e) {
      danmuData = null;
    }
    if (danmuData) {
      // 非同一直播间
      if (danmuData.key !== key) {
        return;
      }
      if (danmuData.data) {
        setDanmu(danmuData.data);
        addHistory(danmuData.data);
      }
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
        var danmuData = {
          key: key,
          data: option.data
        }
        ws.send(2, danmuData);
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
    var color = danmu.color === 16777215 ? "000" : danmu.color.toString(16);
    p.css("color", "#" + color);
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

  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return (r[2]); return null;
  }
})
