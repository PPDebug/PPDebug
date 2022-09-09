# Spring MVC

## 对SpringMVC的理解

SpringMVC实际上是对Servlet的封装，屏蔽掉了Servlet的很多细节。

- 使用Servlet是麻烦的时要不停的从request中getParameter以及向response中setParameter，用的还是字符串，使用SpringMVC则保证参数命与属性名一致，SpringMVC可以直接组装出JavaBean以供我们使用，简化了工作量同时规范了代码，毕竟少使用了字符串。
- 使用servlet上传文件时，要处理各种细节，使用SpringMVC定义@MultipartFile就可以屏蔽上传文件的细节。

## SpringMVC的请求处理流程

1. 首先是统一请求入口(DispatcherServlet 调用方法doService()->doDispatch())
2. 根据请求路径找到对应的映射器(最佳匹配lookupHandlerMethohd() 返回HandlerExceptionChain：映射器Handler+拦截器List)
3. 找到处理请求的适配器(RequestMappingHandlerAdapter)
4. 拦截器前置处理
5. 真实处理请求(invokeAndHandle)
6. 视图解析处理(HttpMessageConverter)
7. 拦截器后置处理

DispatcherServlet（入口）->DispatcherServlet.properties（会初始化的对象）->HandlerMapping（映射器）->HandlerExecutionChain(映射器+拦截器List) ->HttpRequestHandlerAdapter(适配器)->HttpMessageConverter(数据转换)