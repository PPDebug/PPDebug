# Spring AOP

>  Aspect Oriented Programming: 面向切面编程

Spring AOP解决的是非业务代码抽取的问题。

AOP底层技术是动态代理，在Spring内部实现依赖的是BeanPostProcessor。

面向切面编程，就是在方法前后增加非业务代码。

## 使用的例子

> 在项目中，想要监控controller的请求参数和返回信息，但是不想在每个controller中写上相同的log方法

于是利用Aspectj来对controller的public方法当作切入点做了个切面，在`@Around`注释的方法中计算RT并写入日志。
```java
@Aspect
@Component
@Order(1)
public class WebLogAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebLogAspect.class);

    @Pointcut("execution(public * online.pengpeng.mall.controller.*.*(..)) || execution(public * online.pengpeng.mall.*.controller.*.*(..))")
    public void webLog() {
    }

    @Before("webLog()")
    public void doBefore(JoinPoint joinPoint) throws  Throwable{
    }

    @AfterReturning(value = "webLog()", returning = "ret")
    public void doAfterReturning(Object ret) throws Throwable {
    }

    @Around("webLog()")
    public Object doAround(ProceedingJoinPoint jointPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        // 获取当前请求对象
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        // 记录请求头
        WebLog webLog = new WebLog();

        // 真正执行方法
        Object result = jointPoint.proceed();

        Signature signature = jointPoint.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method method = methodSignature.getMethod();
        if (method.isAnnotationPresent(ApiOperation.class)) {
            ApiOperation log = method.getAnnotation(ApiOperation.class);
            webLog.setDescription(log.value());
        }

        long endTime = System.currentTimeMillis();
        String urlStr = request.getRequestURL().toString();

        // ... 输出日志

        return result;
    }

    /**
     * 根据方法和传入的参数获取请求参数
     */
    private Object getParameter(Method method, Object[] args) {
        // ....
    }
}
```


