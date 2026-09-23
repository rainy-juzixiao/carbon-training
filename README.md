# 内容

- `assets/` — 素材
- `contest/` — 竞赛题目
- `backend/` — 初始后端
- `frontend_administrator/` — 管理端前端
- `frontend_user/` — 用户端前端
- `frontend_visual/` — 数据可视化前端

# 运行项目

需要使用MySQL8，phpStudy可以下载到并且同时也需要redis服务器。

使用navicat连接数据库，确保root用户可以使用密码123456进行登录。

后端用IDEA打开backend文件夹。如果不出意外，应该能直接启动。

前端分成了三个部分。所有管理系统的部分，均在frontend_administrator项目中完成。用户端在frontend_user完成编写，数据可视化在frontend_visual完成。

另外，使用vscode打开文件夹的时候，必须确保在终端这边执行如下命令

pnpm install
pnpm run dev

如果没有问题，就应该可以打开，如果报红抽风了，就直接重新执行一次

# 备注

第一模块题目都是平常练习的，没有新题，做题时要认真审题，不要出现会的不得分的情况，赛场上可能遇到不能保存的情况，不要慌，及时举手找技术解决，要做一题保存一题，避免出现黑屏等情况。要是真完蛋了，我能做的就是给你算一卦。

第二模块有情报的时候会同步。
