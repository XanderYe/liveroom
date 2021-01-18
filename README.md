# 私人直播间

## 描述

基于Dplayer和Websocket的私人直播间，匿名观看，支持弹幕发送，需要自行搭建流媒体服务

## 部署方法

### 部署流媒体服务

1. 拉取nginx-rtmp镜像 `docker pull alfg/nginx-rtmp`
2. 创建nginx-rtmp容器 `docker run -itd -p 1935:1935 -p 8080:80 --name nginx-rtmp alfg/nginx-rtmp`

### 推流

1. OBS推流 [OBS官网](https://obsproject.com/) 选自定义服务器，填写rtmp://ip:1935/stream，串流密钥自己写个
2. ffmpeg推流(这个自行研究)

### 部署直播间

1. 修改 [setting.js](./src/main/resources/static/js/setting.js)<br/>
liveUrl中的ip为流媒体服务ip<br/>
key为串流密钥<br/>
username为直播间名称<br/>
支持通过url参数修改key和username，例如`http://localhost:8080?key=串流密钥&username=直播间名称`<br/>
端口为流媒体服务http的端口，对应上面80映射的端口<br/>
test为自定义的串流密钥，和推流的一致
2. 执行mvn clean install，打包jar
3. 部署直播间后台
```
docker run -d \
-p 8078:8078 \
-v /liveroom:/app/ \
--name liveroom fabletang/jre8-alpine:181 \
java -jar /app/liveroom.jar --server.port=8078
```
