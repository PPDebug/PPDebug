# Paxos算法

一种分布式共识算法，在不存在拜占庭问题的情况下是被证明是完备的。

@author Leslie Lamport

* The Part-Time Parliament
* Paxos Made Simple

Paxos算法主要包含两个部分：
* Basic Paxos算法： 多个节点之间如何就某个值达成共识
* Mutli-Paxos思想：执行多个Basicc Paxos实例，就一系列值达成共识。

Paxos算法比较难以理解和实现，Raft算法、ZAB协议、Fast Paxos算法都是基于Paxos算法改进而来。

## Basic Paxos算法

Basic Paxos中的3个角色：
* 提议者(Proposer):也可以叫做协调者(coordinator)，提议者负责接受客户端发起的提议，然后让接收者接受该提议，同时保证即使多个提议者的提议之间产生冲突，算法也能进行下去。
* 接收者(Acceptor): 也可以叫投票员(voter),负责对提议者的提议投票，同时需要记住自己的投票历史。
* 学习者(Learner): 如果有超过半数的接收者就某个提议达成共识，那么学习者就需要接受这个提议，并就该提议做出运算，然后将运算结果返回个客户端。

## Multi Paxos思想

并没有给出具体的代码实现细节，

⚠️ Mulit-Paxos 只是一种思想，这些思想的和兴就是通过多个basic Paxos实例就一系列值达成共识。

两阶段提交是达成共识的常用方式，Basic Paxos就是通过两阶段提交的方式来达成共识，Basic Paxos还支持容错，少于一半节点出现故障时，集群也能正常工作。