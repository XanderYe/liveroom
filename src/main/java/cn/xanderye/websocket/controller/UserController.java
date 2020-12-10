package cn.xanderye.websocket.controller;

import cn.xanderye.websocket.config.WebsocketEndpoint;
import cn.xanderye.websocket.constant.Constant;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.CopyOnWriteArraySet;

/**
 * @author XanderYe
 * @description:
 * @date 2020/12/10 19:01
 */
@RestController
@RequestMapping
public class UserController {
    @RequestMapping("users")
    public String users() {
        CopyOnWriteArraySet<WebSocketSession> users = WebsocketEndpoint.getUsers();
        StringBuilder res = new StringBuilder("当前用户数：" + users.size() + "</br>");
        for (WebSocketSession webSocketSession : users) {
            res.append("sessionId: ").append(webSocketSession.getId())
                    .append("，Ip: ").append(webSocketSession.getAttributes().get(Constant.CLIENT_IP)).append("<br/>");
        }
        return res.toString();
    }
}
