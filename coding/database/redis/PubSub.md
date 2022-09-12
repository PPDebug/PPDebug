# Redis PubSub模式

## 发布订阅

Redis PubSub 模块又称发布订阅者模式，是一种消息传递系统，实现了消息多播功能。发布者（即发送方）发送消息，订阅者（即接收方）接收消息，而用来传递消息的链路则被称为 channel。在 Redis 中，一个客户端可以订阅任意数量的 channel（可译为频道）。

> 消息多播：生产者生产一次消息，中间件负责将消息复制到多个消息队列中，每个消息队列由相应的消费组进行消费，这是分布式系统常用的一种解耦方式。

[PubSub diagram](./assets/PubSub.drawio ":include :type=code")

## 简单使用

- 订阅者等待消息

    打开Redis客户端，订阅`channel`: app.notify

    注意，当调用subscribe命令时会阻塞住。

    ```bash
    127.0.0.1:6379> subscribe app.notify
    Reading messages... (press Ctrl-C to quit)
    1) "subscribe"
    2) "app.notify"
    3) (integer) 1
    ```

- 发布者发布消息

    ```bash
    127.0.0.1:6379> publish app.notify "user1 login, welcome"
    (integer) 1
    127.0.0.1:6379> public app.notify "user2 logout, bye!"
    127.0.0.1:6379> publish app.notify "user2 logout, bye!"
    (integer) 1
    127.0.0.1:6379> publish app.notify "user1 logout, bye!"
    (integer) 1
    127.0.0.1:6379>
    ```

- 订阅者收到消息
    ```bash
    ...
    1) "message"
    2) "app.notify"
    3) "user1 login, welcome"
    1) "message"
    2) "app.notify"
    3) "user2 logout, bye!"
    1) "message"
    2) "app.notify"
    3) "user1 logout, bye!"
    ```

## 常用命令汇总

- PSUBSCRIBE pattern [pattern ...]	

    订阅一个或多个符合指定模式的频道。

- PUBSUB subcommand [argument [argument ...]]	

    查看发布/订阅系统状态，可选参数
    - channel 返回在线状态的频道。
    - numpat 返回指定模式的订阅者数量。
    - numsub 返回指定频道的订阅者数量。
- PUBSUB subcommand [argument [argument ...]]	
    
    将信息发送到指定的频道。

- PUNSUBSCRIBE [pattern [pattern ...]]	

    退订所有指定模式的频道。

- SUBSCRIBE channel [channel ...]	

    订阅一个或者多个频道的消息。

- UNSUBSCRIBE [channel [channel ...]]	
    
    退订指定的频道。
 