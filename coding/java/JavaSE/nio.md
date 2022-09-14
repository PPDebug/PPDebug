# NIO

> @Since JDK 1.4
> 
> No-blocking io / new io

## 普通阻塞IO

<!-- tabs:start -->
#### **TimeServer**
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;

/**
 * 同步阻塞TimeServer
 * @author pengpeng
 */
public class TimeServer {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        if (args!=null && args.length > 0) {
            port = Integer.parseInt(args[0]);
        }

        try (ServerSocket server = new ServerSocket(port)) {
            System.out.println("This time server is start in port: " + port);
            while(true) {
                Socket socket = server.accept();
                new Thread(new TimeServerHandler(socket)).start();
            }
        } finally {
            System.out.println("This server closed!");
        }
    }


    static class TimeServerHandler implements Runnable {
        Socket socket;

        public TimeServerHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
                 PrintWriter out = new PrintWriter(this.socket.getOutputStream(), true)
            ) {
                String currentTime = null;
                String body = null;
                while(true) {
                    body = in.readLine();
                    if (body == null) {
                        break;
                    }
                    System.out.println("This time server receive order: " + body);
                    currentTime = "QUERY TIME ORDER".equalsIgnoreCase(body) ? new Date(System.currentTimeMillis()).toString() : "BAD ORDER";
                    out.println(currentTime);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (this.socket != null) {
                try {
                    this.socket.close();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
                this.socket = null;
            }
        }
    }
}

```
#### **TimeClient**
```java

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 * 同步阻塞TimeClient
 * @author pengpeng
 */
public class TimeClient {
    public static void main(String[] args) throws IOException, InterruptedException {
        int port = 8080;
        if (args!=null && args.length > 0) {
            port = Integer.parseInt(args[0]);
        }
        try(Socket socket = new Socket("localhost", port);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true)
        ) {
            out.println("QUERY TIME ORDER");
            System.out.println("Send order to server succeed.");
            String response = in.readLine();
            System.out.println("Now is: " + response);
        }
    }
}

```
<!-- tabs:end -->

## 伪异步式IO

> 使用线程池

```java
package online.pengpeng.nettylearn.fnio;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;
import java.util.concurrent.*;

/**
 * 围异步式IO，使用线程池创建
 * @author pengpeng
 */
public class TimeServer {
    public static void main(String[] args) throws IOException {
        int port = 8080;
        if (args!=null && args.length > 0) {
            port = Integer.parseInt(args[0]);
        }

        try (ServerSocket server = new ServerSocket(port)) {
            System.out.println("This time server is start in port: " + port);
            Executor executor = new ThreadPoolExecutor(
                    2,
                    2,
                    2,
                    TimeUnit.SECONDS,
                    new ArrayBlockingQueue<Runnable>(2),
                    (Runnable r) -> new Thread(r,"TimeServerHandler"),
                    new ThreadPoolExecutor.AbortPolicy()
            );
            while(true) {
                Socket socket = server.accept();
                executor.execute(new TimeServerHandler(socket));
            }
        } finally {
            System.out.println("This server closed!");
        }
    }


    static class TimeServerHandler implements Runnable {
        Socket socket;

        public TimeServerHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            try (BufferedReader in = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
                 PrintWriter out = new PrintWriter(this.socket.getOutputStream(), true)
            ) {
                String currentTime = null;
                String body = null;
                while(true) {
                    body = in.readLine();
                    if (body == null) {
                        break;
                    }
                    System.out.println("This time server receive order: " + body);
                    currentTime = "QUERY TIME ORDER".equalsIgnoreCase(body) ? new Date(System.currentTimeMillis()).toString() : "BAD ORDER";
                    out.println(currentTime);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
            if (this.socket != null) {
                try {
                    this.socket.close();
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
                this.socket = null;
            }
        }
    }
}

```

## NIO

```java

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;

/**
 * 基于NIO实现TimeServer
 * @author pengpeng
 */
public class TimeServer {

    public static void main(String[] args) {
        int port = 8080;
        if (args != null && args.length > 0) {
            port = Integer.parseInt(args[0]);
        }

        Runnable timeServer = new MultiplexerTimeServer(port);
        new Thread(timeServer, "NIO-MultiplexerTimeServer").start();
    }

    public static class MultiplexerTimeServer implements Runnable {
        private volatile boolean stop;
        private Selector selector;

        public MultiplexerTimeServer(int port) {
            try {
                selector = Selector.open();
                ServerSocketChannel serverChannel = ServerSocketChannel.open();
                serverChannel.configureBlocking(false);
                serverChannel.socket().bind(new InetSocketAddress(port), 1024);
                serverChannel.register(selector, SelectionKey.OP_ACCEPT);
                System.out.println("This time server is start in port:  " + port);
            } catch (IOException e) {
                e.printStackTrace();
                System.exit(1);
            }
        }

        public void stop() {
            this.stop = true;
        }

        @Override
        public void run() {
            while(!stop) {
                try {
                    selector.select(1000);
                    Set<SelectionKey> selectedKeys = selector.selectedKeys();
                    selectedKeys.forEach(this::handleInput);
                    selectedKeys.clear(); // 水平触发，需要手动删除对应数据
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        private void handleInput(SelectionKey key) {
            try {
                if (key.isValid()) {
                    // 如果触发的原因是新的连接，将连接注册到serverChannel上
                    if (key.isAcceptable()) {
                        ServerSocketChannel ssc = (ServerSocketChannel) key.channel();
                        SocketChannel sc = ssc.accept();
                        System.out.println("Connection created: " + sc);
                        sc.configureBlocking(false);
                        sc.register(selector, SelectionKey.OP_READ);
                        return;
                    }
                    // 如果是之前连接的数据到达了
                    if (key.isReadable()) {
                        SocketChannel sc = (SocketChannel) key.channel();
                        ByteBuffer readBuffer = ByteBuffer.allocate(1024);
                        int readBytes = sc.read(readBuffer);
                        if (readBytes > 0) {
                            readBuffer.flip();
                            byte[] bytes = new byte[readBuffer.remaining()];
                            readBuffer.get(bytes);
                            String body = new String(bytes, StandardCharsets.UTF_8);
                            System.out.print("The time server receive order: " + body);
                            String currentTime = "QUERY TIME ORDER".equalsIgnoreCase(body.trim()) ? new Date(System.currentTimeMillis()).toString() : "BAD ORDER";
                            String response = "Current time is: " + currentTime + "\n";
                            System.out.print(response);
                            bytes = response.getBytes();
                            ByteBuffer writeBuffer = ByteBuffer.allocate(bytes.length);
                            writeBuffer.put(bytes);
                            writeBuffer.flip();
                            sc.write(writeBuffer);
                            return;
                        }
                        if (readBytes < 0) {
                            // 关闭链路
                            key.cancel();
                            System.out.println("Connection closed: " + sc);
                            sc.close();
                        }
                        // 读到 0 字节，忽略
                    }
                }
            } catch (Exception e) {
                if (key!=null) {
                    key.channel();
                    if (key.channel() != null) {
                        try {
                            key.channel().close();
                        } catch (IOException ex) {
                            throw new RuntimeException(ex);
                        }
                    }
                }
            }
        }
    }
}


```

## AIO 
```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.concurrent.CountDownLatch;

/**
 * AIO
 * @author pengpeng
 */
public class TimeServer {
    public static void main(String[] args) {
        int port = 8080;
        if (args!=null && args.length>0) {
            port = Integer.parseInt(args[0]);
        }
        new Thread(new AsyncTimeServerHandler(port), "AsyncTimerServerHandler-001").start();
    }

    static class AsyncTimeServerHandler implements Runnable {

        AsynchronousServerSocketChannel serverSocketChannel;
        CountDownLatch latch;

        public AsyncTimeServerHandler(int port) {
            try {
                serverSocketChannel = AsynchronousServerSocketChannel.open();
                serverSocketChannel.bind(new InetSocketAddress(port));
                System.out.println("This time server is start in port: " + port);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public void run() {
            latch = new CountDownLatch(1);
            serverSocketChannel.accept(this, new AcceptCompletionHandler());
            try {
                System.out.println("This thread doing something else...");
                latch.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        /** 新连接建立的回调 */
        static class AcceptCompletionHandler implements CompletionHandler<AsynchronousSocketChannel, AsyncTimeServerHandler> {
            @Override
            public void completed(AsynchronousSocketChannel channel, AsyncTimeServerHandler timeServerHandler) {
                timeServerHandler.serverSocketChannel.accept(timeServerHandler, this);
                ByteBuffer buffer = ByteBuffer.allocate(1024);
                channel.read(buffer, buffer, new ReadCompletionHandler(channel));
                System.out.println("Connection created: " + channel);
            }

            @Override
            public void failed(Throwable exc, AsyncTimeServerHandler attachment) {
                exc.printStackTrace();
                attachment.latch.countDown();
            }
        }
    }

    /** 接受消息的回调 */
    static class ReadCompletionHandler implements CompletionHandler<Integer, ByteBuffer> {
        private final AsynchronousSocketChannel channel;

        public ReadCompletionHandler(AsynchronousSocketChannel channel) {
            this.channel = channel;
        }

        @Override
        public void completed(Integer result, ByteBuffer buffer) {
            buffer.flip();
            byte[] body = new byte[buffer.remaining()];
            buffer.get(body);
            String req = new String(body, StandardCharsets.UTF_8);
            System.out.print("This time server receive order: " + req);
            String currentTime = "QUERY TIME ORDER".equalsIgnoreCase(req.trim()) ? new Date(System.currentTimeMillis()).toString() : "BAD ORDER";
            String response = currentTime + "\n";
            byte[] bytes = response.getBytes();
            ByteBuffer writeBuffer = ByteBuffer.allocate(bytes.length);
            writeBuffer.put(bytes);
            writeBuffer.flip();
            channel.write(writeBuffer, writeBuffer, new CompletionHandler<Integer, ByteBuffer>() {
                @Override
                public void completed(Integer result, ByteBuffer buffer) {
                    if (buffer.hasRemaining()) {
                        channel.write(writeBuffer, writeBuffer, this);
                    }
                    else {
                        System.out.println("Send success!");
                    }
                }

                @Override
                public void failed(Throwable exc, ByteBuffer buffer) {
                    try {
                        System.out.println("Connection closed: " + channel);
                        channel.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        @Override
        public void failed(Throwable exc, ByteBuffer buffer) {
            System.out.println("Connection closed");
        }
    }
}
```
