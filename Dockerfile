# 基础镜像，使用nginx镜像
FROM nginx
#暴露端口
EXPOSE 80
#应用构建成功后的文件被复制到镜像内
COPY ../ /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/nginx.conf
#启动容器时的进程
ENTRYPOINT nginx -g "daemon off;"