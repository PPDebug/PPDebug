# Redis 消息队列

## 什么是Stream

> Stream实际上是一个类似消息队列的组件。
> - broker/consumer

## 优点

Stream拥有很高的性能和内存利用率，提供了消息的持久化存储、以及主从复制功能。


## 工作流程

<!-- [Stream工作流程](./assets/RedisStream.drawio ":include :type=code") -->

## 消息命令汇总

- XADD 	添加消息到末尾。
- XTRIM	对 Stream 流进行修剪，限制长度。
- XDEL	删除指定的消息。
- XLEN	获取流包含的元素数量，即消息长度。
- XRANGE	获取消息列表，会自动过滤已经删除的消息。
- XREVRANGE 	反向获取消息列表，ID 从大到小。
- XREAD	以阻塞或非阻塞方式获取消息列表。
- XGROUP CREATE	创建消费者组。
- XREADGROUP GROUP	读取消费者组中的消息。
- XACK	将消息标记为"已处理"。
- XGROUP SETID	为消费者组设置新的最后递送消息- ID。
- XGROUP DELCONSUMER	删除消费者。
- XGROUP DESTROY	删除消费者组。
- XPENDING	显示待处理消息的相关信息。
- XCLAIM 	转移消息的归属权。
- XINFO	查看 Stream 流、消费者和消费者组的相关信息。
- XINFO GROUPS	查看消费者组的信息。
- XINFO STREAM 	查看 Stream 流信息。
- XINFO CONSUMERS key group	查看组内消费者流信息。

