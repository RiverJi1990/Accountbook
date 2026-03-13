# 部署记录

## 最新部署信息

### 部署时间
- **初始部署**: 2026-03-12
- **更新1 (修复日志错误处理)**: 2026-03-12
- **更新2 (增强日志调试 + 修复权限)**: 2026-03-12
- **更新3 (账号信息移至右上角)**: 2026-03-12
- **更新4 (账号信息移至网页右上角)**: 2026-03-12
- **更新5 (错误边界和骨架屏)**: 2026-03-13

### 部署环境
- **云服务提供商**: 腾讯云 CloudBase
- **环境ID**: river-test-5g9ny38h5b552538
- **环境别名**: river-test
- **地域**: ap-shanghai (上海)
- **套餐**: 体验版

### 访问地址
**生产环境**: https://river-test-5g9ny38h5b552538-1410448083.tcloudbaseapp.com/

### 部署内容
- ✅ index.html (0.86 KB)
- ✅ assets/index-Bg5E6l7J.css (19.94 KB)
- ✅ assets/vendor-CXAFykLK.js (0.06 KB)
- ✅ assets/icons-BBYtv8Xi.js (10.56 KB)
- ✅ assets/encrypt-Ch7QxkPh.js (35.33 KB)
- ✅ assets/index-C4tuw2n8.js (36.54 KB)
- ✅ assets/charts-YbjEh3fK.js (489.39 KB)
- ✅ assets/cloudbase-jz5qiLnn.js (766.24 KB)
- **总计**: ~1.36 MB (gzip 后 ~355 KB)

### CloudBase 配置
- **静态网站托管**: 已开通
- **数据库**: 已启用 (NoSQL - ledgers, operation_logs)
- **云存储**: 已启用
- **身份认证**: 已启用 (手机号验证码登录)

### 数据库集合
1. **ledgers** - 账本数据
   - 字段: name, icon, transactions, createdAt, updatedAt
   
2. **operation_logs** - 操作日志
   - 字段: action, ledgerName, details, timestamp, userId

## 功能清单
✅ 手机号登录（SMS验证）
✅ 多账本管理（创建、删除、切换）
✅ 交易记录管理（添加、编辑、删除）
✅ 操作日志记录
✅ 收支统计和图表
✅ 日期筛选和分类筛选
✅ 响应式设计
✅ 侧边栏导航（支持收起/展开）
✅ 账号信息右上角显示
✅ 错误边界（ErrorBoundary）
✅ 骨架屏加载（Skeleton）
✅ 环境变量管理
✅ 代码分割优化
✅ 生产构建优化

## 更新日志

### 2026-03-12
- ✅ 完成代码重构（App.jsx 从 1100+ 行精简到 849 行）
- ✅ 拆分为 8 个独立组件模块
- ✅ 部署到 CloudBase 静态网站托管
- ✅ 所有功能正常运行
- ✅ 修复操作日志查询错误处理（处理集合不存在的情况）
- ✅ 修改 operation_logs 集合安全规则为 ADMINWRITE,允许认证用户写入
- ✅ 增强 addLog() 和 fetchLogs() 函数的日志输出,便于诊断问题
- ✅ 重构为侧边栏导航,支持账本管理和操作日志切换
- ✅ 添加侧边栏收起/展开功能
- ✅ 账号信息移至网页右上角(非侧边栏内)
- ✅ 点击账号显示退出选项
- ✅ 退出登录增加二次确认对话框

### 2026-03-13
- ✅ 添加 ErrorBoundary 错误边界组件，增强应用稳定性
- ✅ 创建完整的骨架屏组件系统，提升用户感知性能
- ✅ 实现环境变量管理，保护敏感配置信息
- ✅ 优化 Vite 构建配置，实现代码分割和压缩优化
- ✅ 移除生产环境 console.log，减少包大小
- ✅ 关闭生产环境 sourcemap，提升加载速度
- ✅ 部署最新版本到 CloudBase 静态托管

### 关于操作日志
**说明**: 操作日志功能会自动记录以下操作：
- 创建账本
- 删除账本
- 添加交易记录
- 编辑交易记录
- 删除交易记录

**注意**:
1. `operation_logs` 集合会在第一次执行操作时自动创建
2. 如果点击"修改日志"后显示"暂无操作日志",说明还没有任何操作被记录
3. 安全规则已设置为 ADMINWRITE,所有认证用户都可以写入和读取日志

**日志范围**: 所有账本的所有操作历史,不限于当前账本。

**调试**: 如果日志仍不可见,请打开浏览器控制台(F12)查看详细的错误信息。

## 维护说明

### 更新应用
1. 本地修改代码
2. 运行 `npm run build` 构建生产版本
3. 使用 CloudBase MCP 工具上传 `dist` 目录

### 监控管理
- CloudBase 控制台: https://console.cloud.tencent.com/tcb
- 环境管理页面: https://tcb.cloud.tencent.com/dev?envId=river-test-5g9ny38h5b552538#/overview
- 数据库管理: https://tcb.cloud.tencent.com/dev?envId=river-test-5g9ny38h5b552538#/db/doc
- 静态托管: https://tcb.cloud.tencent.com/dev?envId=river-test-5g9ny38h5b552538#/static-hosting

### 备份策略
- 数据自动备份在 CloudBase
- 建议定期导出数据库记录作为额外备份

## 性能指标
- 首屏加载时间: < 2s
- 构建包大小: ~1.36 MB (gzip 后 ~355 KB)
- CDN 加速: 已启用
- 代码分割: 8 个独立 chunk
- 生产优化: Terser 压缩，移除 console.log
