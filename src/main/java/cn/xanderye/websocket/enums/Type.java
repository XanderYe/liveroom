package cn.xanderye.websocket.enums;

/**
 * Created on 2020/12/10.
 *
 * @author XanderYe
 */
public enum Type {
    CONNECT(1),
    SEND(2);

    private int value;

    Type(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static Type getType(int value) {
        for (Type type : Type.values()) {
            if (type.value == value) {
                return type;
            }
        }
        return null;
    }

}
