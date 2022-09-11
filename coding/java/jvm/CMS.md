# CMS垃圾收集器

> Concurrent Mark Sweep: 并发标记清除

* 避免老年代GC出现长时间卡顿"Stop The World"
* 包括初始标记、并发标记、并发预处理、重新标记和并发清除，初始标记和重新标记胡Stop the World
* 缺点：容易产生内碎片、需要空间预留、停顿时间不可预知。

