# Redis持久化

> Redis是基于内存的，如果没有持久化机制，如果 Redis服务器出现某些意外情况，比如宕机或者断电等，那么内存中的数据就会全部丢失。

但有时数据很重要，不能有丢失，因此需要持久化机制

`SAVE`命令会创建当前数据库的备份文件,文件名默认是dump.rdb，存储在redis的安装目录下(可使用`config get dir`查看)

回复数据只需要将dump.rdb放置在安装目录下，然后启动即可。

Redis的持久化有两种：
- RDB: 快照模式
- AOF: 追加模式


## RDB 

快照模式，是Redis的默认数据持久化模式，会将数据快照保存在dump.rdb二进制文件(直接将内存数据以二进制文件的形式保存起来)。

### RDB快照原理

Redis是单线程的，一个线程负责多个套接字的并写读取，以及内存数据结构的逻辑读写。

如果直接在主线程进行数据备份(`SAVE`命令)，由于备份是IO操作比较慢，就会造成`Stop The World`的问题;

如果依赖多线程来进行备份，那备份过程中数据被修改有可能造成数据不一致(备份的数据半属于旧版本，一半属于新版本)；

因此，Redis使用`fork`多进程来进行异步备份(`BGSAVE`)，依赖操作系统的`COW`(写时复制)机制来实现快照持久化，这也是快照名字的由来，毕竟使用fork之后得到的内存是fork时刻的内存镜像。

Redis通过子进程遍历整个内存空间来获取存储的数据，从而完成数据持久化操作，在备份时主进程依然可以对外提供服务，并且修改的内存数据通过COW机制隔离，不会改变备份结果。


### RDB持久化触发机制

- 手动触发

    通过`SAVE`和`BGSAVE`命令将内存数据保存到磁盘文件中

    ```bash
    127.0.0.1:6379> save
    OK
    127.0.0.1:6379> bgsave
    Background saving started
    127.0.0.1:6379> lastsave
    (integer) 1662965708
    127.0.0.1:6379>
    ```
- 自动触发策略

    自动触发策略，是指Redis在指定时间类，数据发生类多少次变化时，会自动执行`BGSAVE`命令，自动触发的条件包含在Redis的配置文件中
    ```conf
    save 900 1 # 表示在 900 秒内，至少更新了 1 条数据，Redis 自动触发 BGSAVE 命令，将数据保存到硬盘。
    save 300 10 # 表示在 300 秒内，至少更新了 10 条数据，Redis 自动触 BGSAVE 命令，将数据保存到硬盘。
    save 60 10000 # 表示 60 秒内，至少更新了 10000 条数据，Redis 自动触发 BGSAVE 命令，将数据保存到硬盘。
    ```
### RDB持久化优劣

RDB主要是IO，是一个消耗资源又浪费时间的操作，因此不能过于频繁的进行。

RDB可能造成数据的丢失：
- 子进程已经fork了父进程，但是在生成rdb过程中计算机崩了，那么这一次的备份数据就会丢失。
- 上一次rdb创建成功，但是现在在没到备份触发条件，机器崩溃了，从上次备份之后的数据丢失。

RDB保存的是内存数据的镜像，因此恢复起来很快，直接读入即可，适用于数据库迁移或集群之间的初始化。

## AOF

AOF被称为追加模式，或日志模式，能够存储Redis服务器执行过的命令(只记录对内存有修改的命令),算一种增量复制的方法，其默认存储文件为appendonly.aof

默认是关闭的，需要手动配置打开，重启
```conf
#修改配置文件，把no改为 yes
appendonly yes
#确定存储文件名是否正确
appendfilename "appendonly.aof"
```

### AOF持久化机制

每当有一个修改数据库的命令被执行时，服务器就将命令写入到appendonly.aof文件中，该文件储存了服务器执行过的所有修改命令，只要服务器从新执行一次。aof文件，就可以实现还原数据的目的。

- 写入机制：

    Redis在收到客户端修改请求后，先进行相应的校验，如果没问题，就立即将命令追加到.aof文件中，然后在执行命令。

    在写入.aof文件时，并不是直接写入，而是放到一个内存缓存区，等到内存缓存区被填满才进行真正写入

- 重写机制

    Redis在长期运行过程中，aof文件会越变越长，如果机器宕机重启，重演整个aof文件会相当耗时，导致长时间Redis无法对外提供服务，因此需要对aof文件压缩

    `BGREWRITEAOF`文件可以重写aof文件，在不不改变执行结果的情况下减少命令数量

    原有aof文件	
    ```bash
    select 0	 
    sadd myset Jack
    sadd myset Helen 
    sadd myset JJ
    sadd myset Lisa	 
    INCR number	 
    INCR number	 
    DEL number	 
    SET message 'www.baidu.com'	 
    SET message 'www.biancheng.net'	 
    RPUSH num 2 4 6	 
    RPUSH num 8	 
    LPOP num
    ```
    重写后的aof文件
    ```bash
    SELECT 0
    SADD myset Jack Helen JJ Lisa
    SET msg 'hello tarena'
    RPUSH num 4 6 8
    ```
### 自动触发AOF重写功能

    ```conf
    auto-aof-rewrite-percentage 100 # 当 aof 文件的增量大于 100% 时才进行重写，也就是大一倍。比如，第一次重写时文件大小为 64M，那么第二次触发重写的体积为 128M
    auto-aof-rewrite-min-size 64mb #表示触发AOF重写的最小文件体积,大于或等于64MB自动触发。
    ```
### AOF策略配置

AOF的写入缓冲区决定了在宕机的时候，可能会丢失缓冲区中的指令

因此Redis可以自己设置策略配置

```conf
# appendfsync always  # 服务器每写入一个命令，就调用一次 fsync 函数，将缓冲区里面的命令写入到硬盘,不会丢失任何已经成功执行的命令数据，但是其执行速度较慢；
appendfsync everysec  # 服务器每一秒调用一次 fsync 函数，将缓冲区里面的命令写入到硬盘
# appendfsync no  # 务器不主动调用 fsync 函数，由操作系统决定何时将缓冲区里面的命令写入到硬盘。
```

如果进行数据恢复时，既有 dump.rdb文件，又有 appendonly.aof 文件，应该先通过 appendonly.aof 恢复数据，这能最大程度地保证数据的安全性。













