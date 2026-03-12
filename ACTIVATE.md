# 激活 CloudBase 静态网站托管

## 问题
当前静态网站托管状态为"处理中"，需要手动激活。

## 解决步骤

### 1. 打开 CloudBase 控制台
访问：https://console.cloud.tencent.com/tcb

### 2. 选择环境
- 点击环境：`river-test`
- 环境ID：`river-test-5g9ny38h5b552538`

### 3. 开启静态网站托管
1. 在左侧菜单中找到"静态网站托管"
2. 点击进入
3. 如果显示"未开通"，点击"开通静态网站托管"
4. 等待开通完成（约1分钟）

### 4. 配置静态网站
1. 在"静态网站托管"页面，点击"文件管理"
2. 点击"上传文件"
3. 上传 `dist` 文件夹中的所有文件：
   - `index.html`
   - `assets/` 文件夹及内容

### 5. 验证部署
1. 上传完成后，在"基础信息"中找到"默认访问域名"
2. 复制域名并在浏览器中访问
3. 确认记账本应用正常运行

---

## 快速操作

1. 打开：https://console.cloud.tencent.com/tcb/env/account?rid=1
2. 找到环境 `river-test`
3. 点击进入
4. 左侧菜单 → 静态网站托管
5. 点击"开通"
6. 上传 `dist` 文件夹内容

---

## 备选方案

如果网页方式操作不便，也可以：

1. 访问静态网站托管管理页面：
   https://console.cloud.tencent.com/tcb/hosting/setting?rid=1&envId=river-test-5g9ny38h5b552538

2. 按照页面提示操作

---

## 预期结果

激活后，你应该能够通过以下地址访问：
https://river-test-5g9ny38h5b552538-1410448083.tcloudbaseapp.com
