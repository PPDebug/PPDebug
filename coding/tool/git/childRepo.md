# Git子仓库

> 使用场景：项目中部分代码可能会其他项目使用公用，或者希望其中的部分代码可以单独发布使用。比如一个项目中的多个独立的Demo。

## Git子仓库的定义

一个Git仓库下面放了其他的Git仓库，其他Git仓库就是父级仓库的子仓库。

子仓库有两种使用方式：
* submodule
* subtree

## 使用submodules模块

### 创建带有子模块的仓库

Git子模块允许将一个或多个Git仓库作为另一个仓库的子目录，能让另一个仓库克隆到项目中，同时还保持提交的独立。

创建两个目录(同级):
- main: 父模块
- lib: 子模块

两个目录分别进行git初始化`git init`,然后进行一次提交

```shell
cd main
echo "console.log('main');" > index.js
git add .
git commit -m "feat: create index.js"
git push

cd ../lib
echo "console.log('utils');" > util.js
git add .
git commit -m "feat: create util.js"
git push
```

初始化两个仓库后，想让main主仓库能够使用lib仓库的代码进行后续的开发，通过git submoudle add命令进行
```shell
cd main
git submooudle add "https://your git repo address/"
```

执行完上述命令后，查看main仓库下当前的目录结构
```shell
tree
.
├── index.js
├── .gitmodules
└── lib
    └── util.js
```
lib目录已经出现在子目录下了，同时还有一个.gitmoudles文件，保存了子仓库项目的url和主仓库目录下的映射关系：
```shell
cat .gitsubmodules

[submodule "lib"]
    path = lib
    url = /path/to/repos/lib.git
```
执行git status, 会发现添加进来的是新文件
```
git status

On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   .gitmodules
        new file:   lib
```
对main仓库进行一次提交
```
git add .
git commit -m "feat: 增加了子仓库依赖"
git push
```


### 克隆带有子模块的仓库

当我们正常克隆main项目时，main仓库中虽然包含有lib文件夹，但里面并不包含任何内容，只是空文件夹。需要运行下面两条命令来初始化子模块
```shell
git submodule init
git submodule update
```

当然可以默认初始化,直接拉取
```
git clone --recursive "git repo url"
```

### 在主仓库上进行协同开发
在main仓库下对lib文件做了一些修改，然后想提交父仓库和子仓库的修改，此时应该先提交子仓库的修改
```shell
pwd
> main
cd lib
```
执行了这个操作之后，其实已经到了lib仓库的分支上了，对应一个完整的子仓库，直接正常操作就可以了
```shell
git add .
git commit -m "style: logs msg change"
git push 
```
子仓库提交结束后，在主目录下执行
```shell
cd ../
git status
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   lib (new commits)

no changes added to commit (use "git add" and/or "git commit -a")
```

这里表明有新的提交,直接正常的commit、push即可
```shell
git commit -a -m "perf: update lib moudule"```
git push
```

对所有的子仓库刘拉取最新的代码
```shell
git submodule foreach git pull
```

### git submodule注意点

* 当子模块有提交的时候,没有push到远程仓库, 父级引用子模块的commit更新,并提交到远程仓库, 当别人拉取代码的时候就会报出子模块的commit不存在 fatal: reference isn’t a tree。
* 如果你仅仅引用了别人的子模块的游离分支,然后在主仓库修改了子仓库的代码,之后使用git submodule update拉取了最新代码,那么你在子仓库游离分支做出的修改会被覆盖掉。
* 我们假设你一开始在主仓库并没有采用子模块的开发方式,而是在另外的开发分支使用了子仓库,那么当你从开发分支切回到没有采用子模块的分支的时候,子模块的目录并不会被Git自动删除,而是需要你手动的删除了 。

## Git subtree(子树合并)

git submodule是git自带的原生功能，git subtree是第三方贡献者开发的。是通过Git底层命令写出的一个高层次脚本，所以是有基础的Git命令来实现的。

### 开始使用子树合并

首先在本地创建main和lib的子仓库，然后对两个仓库各自进行一次提交,同上。

利用git subtree来追踪两个子仓库
```shell
cd main

git subtree add --prefix=lib /path/to/repos/lib.git master

git fetch /path/to/repos/lib.git master

warning: no common commits
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Total 3 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (3/3), done.
From /path/to/repos/lib
 * branch            master     -> FETCH_HEAD
Added dir 'lib'
```

### 克隆含有子项目的仓库

完全可以想拉去普通仓库一行支持克隆即可。
```shell
git clone "repo url"
```

### 在主仓库上进行协同开发

在主仓库中对lib进行修改后，执行git status查看
```shell
git status

On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

        modified:   lib/util.js

no changes added to commit (use "git add" and/or "git commit -a")
```
可以看见子仓库中的更改详情。
同时subtree的lib目录并不包含.git因此需要另外的拉取和推送操作
```shell
git subtree pull
git subtree push
```
针对在主仓库对子仓库代码的修改，需要对主仓库进行一次提交（subtree 的提交模式是从主仓库的提交历史下拆分部分commit出去给子仓库进行提交）

```shell
# 提交主仓库
git add .
git commit -m "pref: update subtree  lib"

# 首先要拉取一下子仓库是否存在更新
# 如果拉取子仓库的过程中存在冲突,需要在主仓库解决冲突后重新提交一次commit
git subtree pull --prefix /path/to/repos/lib.git master

From /path/to/repos/lib
 * branch            master     -> FETCH_HEAD
Subtree is already at commit a5f21e31a721920ba7007949f3db59df4b543436.

# push代码到子仓库\
git subtree push --prefix /path/to/repos/lib.git master
```



