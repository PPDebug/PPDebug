# Redis集群

单点Redis受限于机器内存，只能通过提高机器配置的方法来升级，但单机性能始终是有限的，可以利用Redis集群的方式来实现横向扩展。

## 主从模式

### 主从模式基本原理

主从模式（Master-Slave）是使用较多的一种架构。主（Master）和从（Slave）分别部署在不同的服务器上，当主节点服务器写入数据时，同时也会将数据同步至从节点服务器，通常情况下，主节点负责写入数据，而从节点负责读取数据。


[Master Slave Diagram](./assets/MasterSlave.drawio ":include :type=code")

Redis 主机会一直将自己的数据复制给 Redis 从机，从而实现主从同步。在这个过程中，只有 master 主机可执行写命令，其他 salve 从机只能只能执行读命令，这种读写分离的模式可以大大减轻 Redis 主机的数据读取压力，从而提高了Redis 的效率，并同时提供了多个数据备份。主从模式是搭建 Redis Cluster 集群最简单的一种方式。

### 主从模式使用

- 命令行设置

    ```shell
    #开启开启一个port为6300的从机，它依赖的主机port=6379
    redis-server --port 6300 --slaveof 127.0.0.1 6379
    ```

- 配置文件设置
    - 新建 redis_6302.conf 文件,并添加以下配置信息：
    ```conf
    slaveof 127.0.0.1 6379 #指定主机的ip与port
    port 6302 #指定从机的端口
    ```
    - 启动 Redis 服务器
    ```shell
    $ redis-server redis_6302.conf
    ```
    - 客户端连接服务器，并进行简单测试
    ```bash
    $ redis-cli -p 6302
    127.0.0.1:6300> HSET user:username biangcheng
    #写入失败
    (error) READONLY You can't write against a read only slave.
    ```
### 主从模式不足

- Redis 主从模式不具备自动容错和恢复功能，如果主节点宕机，Redis 集群将无法工作，此时需要人为干预，将从节点提升为主节点。
- 如果主机宕机前有一部分数据未能及时同步到从机，即使切换主机后也会造成数据不一致的问题，从而降低了系统的数据一致性。
- 因为只有一个主节点，所以其写入能力和存储能力都受到一定程度地限制。
- 在进行数据全量同步时，若同步的数据量较大可能会造卡顿的现象。

## Sentinel哨兵模式

> Redis 主从复制模式中，因为系统不具备自动恢复的功能，所以当主服务器（master）宕机后，需要手动把一台从服务器（slave）切换为主服务器。在这个过程中，不仅需要人为干预，而且还会造成一段时间内服务器处于不可用状态，同时数据安全性也得不到保障，因此主从模式的可用性较低，不适用于线上生产环境。

### 哨兵模式原理

哨兵模式是一种特殊的模式，Redis 为其提供了专属的哨兵命令，它是一个独立的进程，能够独立运行。

[Sentinel Diagram](./assets/Sentinel.drawio ":include :type=code")

### 多哨兵模式

Redis Sentinel 是集群的高可用的保障，为避免 Sentinel 发生意外，它一般是由 3～5 个节点组成，这样就算挂了个别节点，该集群仍然可以正常运转。

[MutilSentinel Diagram](./assets/MutilSentinel.drawio ":include :type=code")


- 主观下线

    适用于主服务器和从服务器。如果在规定的时间内(配置参数：down-after-milliseconds)，Sentinel 节点没有收到目标服务器的有效回复，则判定该服务器为“主观下线”

- 客观下线

    只适用于主服务器。 Sentinel1 发现主服务器出现了故障，它会通过相应的命令，询问其它 Sentinel 节点对主服务器的状态判断。如果超过半数以上的  Sentinel 节点认为主服务器 down 掉，则 Sentinel1 节点判定主服务为“客观下线”

- 投票选举

    投票选举，所有 Sentinel 节点会通过投票机制，按照谁发现谁去处理的原则，选举 Sentinel1 为领头节点去做 Failover（故障转移）操作。Sentinel1 节点则按照一定的规则在所有从节点中选择一个最优的作为主服务器，然后通过发布订功能通知其余的从节点（slave）更改配置文件，跟随新上任的主服务器（master）。至此就完成了主从切换的操作。

### 哨兵模式的应用

> 待补充...