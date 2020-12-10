package cn.xanderye.websocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * @author XanderYe
 * @description:
 * @date 2020/12/9 22:19
 */
@Configuration
public class WebsocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {
        webSocketHandlerRegistry.addHandler(new WebsocketEndpoint(), "/websocket/init*")
                .addInterceptors(new HandshakeInterceptor()).setAllowedOrigins("*");
    }
}
