package cn.xanderye.websocket.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.web.bind.annotation.*;

/**
 * Created on 2020/12/10.
 *
 * @author XanderYe
 */
@RestController
@RequestMapping
public class DplayerController {
    @GetMapping("v3")
    public JSONObject list(String id) {
        JSONObject res = new JSONObject();
        res.put("code", 0);
        JSONArray danmuArray = new JSONArray();
        JSONObject welcome = new JSONObject();
        welcome.put("color", "#FFF");
        welcome.put("text", "欢迎来到XanderYe的直播间，请文明发言");
        welcome.put("type", "right");
        danmuArray.add(welcome);
        res.put("data", danmuArray);
        return res;
    }

    @PostMapping("v3")
    public JSONObject add(@RequestBody JSONObject params) {
        JSONObject res = new JSONObject();
        res.put("code", 0);
        res.put("data", "");
        return res;
    }
}
