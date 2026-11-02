# IsoCity 云服务器部署包

## 包内容

| 文件 | 说明 |
|---|---|
| `site/` | 静态站点（浏览器直接玩，已瘦身 webp 版） |
| `IsoCity-debug.apk` | Android 安装包（46MB，debug 签名，非商用可直接分发） |
| `install.sh` | Ubuntu 一键部署脚本（自动装 nginx、部署文件、配置站点） |
| `isocity.nginx.conf` | nginx 站点配置（gzip、静态缓存、APK 直链下载） |

## 部署步骤（MobaXterm，2 分钟）

1. 把 `gufeng-deploy.tar.gz` 上传到服务器（如 `/root/`）
2. 在服务器上执行：

```bash
tar xzf gufeng-deploy.tar.gz
cd gufeng-deploy
sudo bash install.sh
```

3. 完成后：
   - 浏览器玩：`http://<服务器IP>/`
   - 手机下载 APK：`http://<服务器IP>/IsoCity-debug.apk`

## 注意事项

- **云安全组**：需放行 TCP 80 入方向（控制台操作）
- **已有网站的服务器**：脚本会移除 Ubuntu 默认站点让本站接管根路径；若服务器上已有别的网站，先编辑 `isocity.nginx.conf`（去掉 `default_server` 或换端口）再执行
- **域名**：如果后续要绑域名走 80/443，国内服务器需要 ICP 备案；**直接用 IP 访问不受影响**（当前方案）
- **更新版本**：本地重新 `next build` + `node scripts/slim-out.mjs` 后，重新打包 `site/` 覆盖服务器 `/var/www/isocity/` 即可（或让我做增量上传）
