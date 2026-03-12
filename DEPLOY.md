# CloudBase 部署指南

## 方法一：网页控制台部署（简单快速）

### 步骤 1：创建 CloudBase 环境
1. 访问腾讯云 CloudBase：https://console.cloud.tencent.com/tcb
2. 点击"新建环境"
3. 选择计费方式：**按量付费**（有免费额度）
   - 免费额度：2GB 存储 + 5GB 流量/月
4. 选择地域：推荐选择 **上海** 或 **广州**（国内访问快）
5. 输入环境名称：`expense-tracker`
6. 点击"立即创建"

### 步骤 2：开启静态网站托管
1. 进入刚创建的环境
2. 点击左侧菜单"静态网站托管"
3. 点击"开通静态网站托管"
4. 等待开通完成（约1分钟）

### 步骤 3：上传项目文件
1. 在"静态网站托管"页面，点击"文件管理"
2. 点击"上传文件"
3. 将 `dist` 文件夹中的所有文件上传：
   - `index.html`
   - `assets/` 文件夹及其内容

### 步骤 4：访问应用
1. 上传完成后，在"基础信息"中可以看到"默认访问域名"
2. 复制该域名，在浏览器中访问
3. 就可以在线使用记账本了！

---

## 方法二：CLI 命令行部署（适合开发者）

### 步骤 1：安装 CLI 工具
```bash
npm install -g @cloudbase/cli
```

### 步骤 2：登录
```bash
cloudbase login
```
会自动打开浏览器，扫码登录腾讯云账号

### 步骤 3：创建环境（如已有环境可跳过）
```bash
cloudbase env:create expense-tracker
```

### 步骤 4：构建项目
```bash
npm run build
```

### 步骤 5：部署到 CloudBase
```bash
cloudbase hosting deploy dist -e expense-tracker
```

### 步骤 6：查看访问地址
```bash
cloudbase hosting detail -e expense-tracker
```

---

## 访问你的应用

部署成功后，你可以通过以下方式访问：

1. **默认域名**（免费提供）
   - 格式：`https://xxxx.tcb.qcloud.la`
   - 无需备案，可直接访问
   - 有流量限制

2. **自定义域名**（需要备案）
   - 需要购买域名
   - 需要在工信部备案
   - 在 CloudBase 中配置自定义域名

---

## 常见问题

### Q: 免费额度够用吗？
A: 对于个人记账本应用，免费额度完全够用：
- 2GB 存储（项目很小）
- 5GB 流量/月（日常使用绰绰有余）

### Q: 默认域名会有问题吗？
A: 默认域名完全可以正常使用，只是有流量限制。如果需要更好的性能或自定义域名，可以升级付费。

### Q: 如何更新应用？
A: 只需重新构建并上传文件：
- 网页版：删除旧文件，上传新文件
- CLI：再次运行 `cloudbase hosting deploy dist -e expense-tracker`

### Q: 可以绑定自己的域名吗？
A: 可以，但需要：
1. 购买域名
2. 完成备案（国内域名必须）
3. 在 CloudBase 中配置自定义域名

---

## 快速开始

推荐使用**网页控制台部署**，最简单快捷：

1. 访问 https://console.cloud.tencent.com/tcb
2. 创建环境（免费）
3. 开通静态网站托管
4. 上传 `dist` 文件夹
5. 获得访问链接，开始使用！

就这么简单！🎉
