# Redis

## Redis的使用场景

Redis一般用作分布式缓存

是否使用Redis取决于业务需求：
* 有些简单的场景一个HashMap就可解决就没必要使用Redis了

## Redis的数据结构

### String (字符串)

字符串是一组字节，在redis数据库中，字符串具有二进制安全特性，即长度已知，不受终止字符决定
```c
struct sdshdr{
     //记录buf数组中已使用字符的数量，等于 SDS 保存字符串的长度
     int len;
     //记录 buf 数组中未使用的字符数量
     int free;
     //字符数组，用于保存字符串
     char buf[];
}
```
> 一个String最大512MB

`SET/GET`
```bash
127.0.0.1:6379> set user 'ppdebug'
OK
127.0.0.1:6379> get user
"ppdebug"
```

`MSET/MGET`: 设置多个
```bash
127.0.0.1:6379> MSET age 21 gender male
OK
127.0.0.1:6379> MGET age gender
1) "21"
2) "male"
```

### Hash (哈希散列)

hash散列是由字符串类型的field和value组成的映射表，可以理解成一个包含多个键值对的集合，一边用来存储对象。
> 一个Hash中最多包含2<sup>32</sup>-1个键值对

`HMSET/HGETALL/HGET`
```bash
127.0.0.1:6379> HMSET user:001 username 'ppdebug' age 21 gender male
OK
127.0.0.1:6379> HGETALL user:001
1) "username"
2) "ppdebug"
3) "age"
4) "21"
5) "gender"
6) "male"
127.0.0.1:6379> HGET user:001 username
"ppdebug"
```

### List (列表)
Redis List中二元素是字符串类型，其中元素按照插入顺序进行排序，允许重复插入，最开始插入的在最后，最后插入的在第一个位置(队列)
> 最多可插入的元素为2<sup>32</sup>-1
```bash
127.0.0.1:6379> lpush coding c
(integer) 1
127.0.0.1:6379> lpush coding c++
(integer) 2
127.0.0.1:6379> lpush coding java
(integer) 3
127.0.0.1:6379> lpush coding python
(integer) 4
127.0.0.1:6379> lpush coding javascript
(integer) 5
127.0.0.1:6379> lpush coding shell
(integer) 6
127.0.0.1:6379> lrange coding 0 6
1) "shell"
2) "javascript"
3) "python"
4) "java"
5) "c++"
6) "c"
```
### Set (集合)
Redis Set是一个字符串元素哥抽的无序集合，通过哈希映射表实现，无论是添加元素、删除元素、抑或是查找元素，时间复杂度都为O(1)
> 最多可插入的元素为2<sup>32</sup>-1
```bash
127.0.0.1:6379> SADD animals cat
(integer) 1
127.0.0.1:6379> SADD animals dog
(integer) 1
127.0.0.1:6379> SADD animals fish
(integer) 1
127.0.0.1:6379> SADD animals cat
(integer) 0
127.0.0.1:6379> SMEMBERs animals
1) "dog"
2) "fish"
3) "cat"
```
### Zset(有序集合)
Redis zet是一个字符串类型元素数据构成的有序集合，集合中的元素不仅具有唯一性，而且每个元素还会关联一个double类型的权值，用于排序
> 如果元素存在与集合中，则不能添加成功
```bash
127.0.0.1:6379> ZADD hellogithub 1 python
(integer) 1
127.0.0.1:6379> ZADD hellogithub 2 C
(integer) 1
127.0.0.1:6379> ZADD hellogithub 3 Java
(integer) 1
127.0.0.1:6379> ZADD hellogithub 4 C++
(integer) 1
127.0.0.1:6379> ZSCORE hellogithub Java
"3"
127.0.0.1:6379> zrange hellogithub 0 4
1) "python"
2) "C"
3) "Java"
4) "C++"
```

### BitMap 位图()

存取bool类型的数据，位运算高效，实际使用的也是string

自动扩容，当index大于len时扩容

使用场景，用户签到，在线人数等

```bash
127.0.0.1:6379> SETBIT ums:online 7 1
(integer) 0
127.0.0.1:6379> GET ums:online
"\x01"
127.0.0.1:6379> SETBIT ums:online 8 1
(integer) 0
127.0.0.1:6379> GET ums:online
"\x01\x80"
127.0.0.1:6379> BITCOUNT ums:online 0 15
(integer) 2
```
### HyperLogLog (基数统计)
适用于海量数据的计算统计，其特点是占用空间小，计算速度快。

采用的是基数估计方法，最终的结果可能会有一定范围的误差(0.81%)，每个HyperLogLog只占用12KB内存，所以理论上可以存储2<sup>64</sup>个值，而set是元素越多占用内存就越大。

HyperLogLog不会记录元素本身的值，因此不能返回具体的元素值。

HyperLogLo可以用于统计网站用户月活量或UV(网站独立访客，同一个用户一天做多只能计数一次)数据。

`PFADD/PFCOUNT`

`PFMERGE`： 合并两个键
```bash
127.0.0.1:6379> PFADD ums:uv:20220101 user1 user2 user3
(integer) 1
127.0.0.1:6379> PFCOUNT ums:uv:20220101
(integer) 3
127.0.0.1:6379> PFADD ums:uv:20220102 user4 user5 user5
(integer) 1
127.0.0.1:6379> PFCOUNT ums:uv:20220102
(integer) 2
127.0.0.1:6379> PFCOUNT ums:uv:20220101 ums:uv:20220102
(integer) 5
127.0.0.1:6379> PFMERGE ums:uv:20220101-02 ums:uv:20220101 ums:uv:20220102
OK
127.0.0.1:6379> PFCOUNT ums:uv:20220101-02
(integer) 5
```
### GEO (地理位置)

实际上还是zset类型的

可以用在摇一摇之类的东西上

```bash
127.0.0.1:6379> GEOADD ums:pos 105.3 61.5 mine
(integer) 1
127.0.0.1:6379> GEOADD ums:pos 100 60 user1
(integer) 1
127.0.0.1:6379> GEOADD ums:pos 90 50 user2
(integer) 1
127.0.0.1:6379> GEOADD ums:pos 110 65 user3
(integer) 1
127.0.0.1:6379> GEOPOS ums:pos mine
1) 1) "105.29999881982803345"
   2) "61.49999905498822272"
127.0.0.1:6379> GEODIST ums:pos mine user1
"332728.6602"
127.0.0.1:6379> GEORADIUSBYMEMBER ums:pos mine 30000 km
1) "user2"
2) "user1"
3) "mine"
4) "user3"
127.0.0.1:6379> GEORADIUSBYMEMBER ums:pos mine 30000 km  ASC
1) "mine"
2) "user1"
3) "user3"
4) "user2"
127.0.0.1:6379> type ums:pos
zset
```


## Redis为什么快
- 是纯内存数据库，内存本来就快
- 单线程, 利用基于非阻塞的IO多路复用机制，单线程避免了多线程的平凡上下文切换问题

