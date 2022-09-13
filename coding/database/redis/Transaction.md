# Redis事务

> Redis事务的是方便用户一次执行多个命令，执行Redis事务可分为三个阶段。
>- 开始事务
>- 命令入队
>- 执行事务

## Redis事务特性

- 单独的隔离操作

    事务中所有的命令都会被序列化，将按照顺序执行，并且在执行过程中，不会被其他客户端发送来的命令打断。

- 不保证原子性

    在Redis的事务中，如果存在命令执行失败的情况，那么其他命令依然会会被执行，不支持事务回滚机制。

## Redis事务命令 

- MULTI	开启一个事务
- EXEC	执行事务中的所有命令
- WATCH key [key ...]	在开启事务之前用来监视一个或多个key 。如果事务执行时这些 key 被改动过，那么事务将被打断。
- DISCARD	取消事务。
- UNWATCH	取消 WATCH 命令对 key 的监控。

## 简单使用

利用`watch`监听只读变量，防止被修改

```bash
开启事务之前设置key/value，并监听
127.0.0.1:6379> set www.biancheng.net hello
OK
127.0.0.1:6379> WATCH www.biancheng.net
OK
127.0.0.1:6379> get www.biancheng.net
"hello"
#开启事务
127.0.0.1:6379> MULTI
OK
#更改key的value值
127.0.0.1:6379> set www.biancheng.net HELLO
QUEUED
127.0.0.1:6379> GET www.biancheng.net
QUEUED
#命令执行失败
127.0.0.1:6379> EXEC
(error) EXECABORT Transaction discarded because of previous errors.
#取消监听key
127.0.0.1:6379> UNWATCH 
OK 
```


