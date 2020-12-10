package cn.xanderye.websocket.entity;

import cn.xanderye.websocket.enums.Type;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * Created on 2020/12/10.
 *
 * @author XanderYe
 */
@Data
@Accessors(chain = true)
public class Command {

    private Integer commandType;

    private String commandData;
}
