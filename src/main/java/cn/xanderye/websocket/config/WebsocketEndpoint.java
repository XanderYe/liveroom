package cn.xanderye.websocket.config;

import cn.xanderye.websocket.constant.Constant;
import cn.xanderye.websocket.entity.Command;
import cn.xanderye.websocket.enums.Type;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * @author XanderYe
 * @description:
 * @date 2020/12/9 22:21
 */
@Slf4j
public class WebsocketEndpoint extends TextWebSocketHandler {

    private static CopyOnWriteArraySet<WebSocketSession> users = new CopyOnWriteArraySet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("新设备接入");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        send(session, message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.debug("用户退出，剩余在线用户：{}, ID：{}", users.size(), session.getId());
        try {
            users.remove(session);
            if (session.isOpen()) {
                session.close();
            }
        } catch (IOException e) {
            log.error("session关闭失败，ID：{}", session.getId());
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        users.remove(session);
        if (session.isOpen()) {
            session.close();
        }
        log.error("session异常，ID：{}", session.getId());
    }

    private void send(WebSocketSession session, TextMessage message) {
        Map<String, Object> attr = session.getAttributes();
        log.info("{} 发送消息：{}，IP: {}", session.getId(), message.getPayload(), attr.get(Constant.CLIENT_IP));
        Command command = JSON.parseObject(message.getPayload(), Command.class);
        Type type = null;
        if (null != command.getCommandType()) {
            type = Type.getType(command.getCommandType());
        }
        assert type != null;
        switch (type) {
            case CONNECT:
                connect(session);
                break;
            case SEND:
                sendToUsers(session, command, message);
                break;
            default:
                break;
        }
    }

    private void connect(WebSocketSession webSocketSession) {
        users.add(webSocketSession);
        log.info("用户加入集合，ID：{}", webSocketSession.getId());
    }

    private synchronized void sendToUsers(WebSocketSession sourceSession, Command command, TextMessage textMessage) {
        for (WebSocketSession webSocketSession : users) {
            if (webSocketSession.isOpen() && !sourceSession.getId().equals(webSocketSession.getId())) {
                sendMessage(webSocketSession, textMessage.getPayload());
            }
        }
        log.info("{} 发送消息完毕", sourceSession.getId());
    }

    private synchronized void sendMessage(WebSocketSession webSocketSession, String message) {
        if (webSocketSession.isOpen()) {
            try {
                webSocketSession.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                log.error("发送消息失败，失败原因：{}", e.getMessage());
            }
        }
    }

    public static CopyOnWriteArraySet<WebSocketSession> getUsers() {
        return users;
    }
}
