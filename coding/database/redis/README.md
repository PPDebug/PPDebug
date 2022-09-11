# Redis

## Redis的使用场景

Redis一般用作分布式缓存

是否使用Redis取决于业务需求：
* 有些简单的场景一个HashMap就可解决就没必要使用Redis了

## Redis的数据结构

- String
- Set
- List
- Hash

## Redis为什么快
- 是纯内存数据库，内存本来就快
- 单线程, 利用基于非阻塞的IO多路复用机制，单线程避免了多线程的平凡上下文切换问题

