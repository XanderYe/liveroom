function Websocket(url, callback) {
  this.url = url;
  this.onMessage = callback;

  var websocket = null;

  var that = this;

  //判断当前浏览器是否支持WebSocket
  if ('WebSocket' in window) {
    websocket = new WebSocket(that.url);
  } else {
    alert('当前浏览器不支持websocket');
  }

  //接收到消息的回调方法
  websocket.onmessage = function (event) {
    if (that.onMessage) {
      that.onMessage(event);
    }
  }

  //连接成功建立的回调方法
  websocket.onopen = function () {
    console.log("打开websocket");
    connect();
  }

  //连接关闭的回调方法
  websocket.onclose = function () {
    console.log("关闭websocket");
  }

  //连接发生错误的回调方法
  websocket.onerror = function () {
    console.log("出错");
  };

  //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  window.onbeforeunload = function () {
    closeWebSocket();
  }

  //关闭WebSocket连接
  function closeWebSocket() {
    websocket.close();
  }

  function connect() {
    console.log("发起连接");
    var message = {commandType: 1};
    websocket.send(JSON.stringify(message));
  }

  Websocket.prototype.send = function (type, data) {
    var message = {
      commandType: type,
      commandData: data
    };
    websocket.send(JSON.stringify(message));
  }
}
