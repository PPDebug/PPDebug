# Redis分布式锁应用

> 在分布式系统中当不同的进程或线程一起访问共享资源的时候，会造成资源争夺，如果不加以控制，就会引发程序错乱，分布式锁利用一种互斥机制来防止线程或进程相互干扰，从而保证了数据的一致性。

## Redis分布式锁特性

- 互斥性：任何时候只有一个线程能够持有锁
- 锁的超时时间：一个线程在持锁期间挂掉而没主动释放锁，此时同构超时时间来保证线程在超时后可以释放锁，这样其他线程才可以继续获得锁。
- 加锁和解锁必须有一个线程来设置
- Redis是缓存数据库，用于很高的性能，因此加锁和释放锁开销较小，并且能够很轻易的实现分布式锁。

## Redis 分布式锁命令

- SETNX key val：仅当key不存在时，设置一个 key 为 value 的字符串，返回1；若 key 存在，设置失败，返回 0；
- Expire key timeout：为 key 设置一个超时时间，以 second 秒为单位，超过这个时间锁会自动释放，避免死锁；
- DEL key：删除 key。

```bash
127.0.0.1:6379> SETNX WEBNAME www.biancheng.net
(integer) 1
127.0.0.1:6379> EXPIRE WEBNAME 60
(integer) 1
127.0.0.1:6379> GET WEBNAME
"www.biancheng.net"
127.0.0.1:6379> TTL WEBNAME
(integer) 33
127.0.0.1:6379> SET name www.biancheng.net EX 60 NX
OK
```



