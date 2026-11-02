# Android 打包指南（Capacitor）

## 工具链（本机）

| 组件 | 位置 |
|---|---|
| Node v24 | `C:\Users\ASUS\.codely\Default\tools\node-v24.16.0-win-x64`（npm 用 npm.cmd 调用） |
| **JDK 21**（必需，Capacitor 7.6.10 的 android 库要求 Java 21 源码级；Unity 自带的 JDK 17 不够） | `C:\Users\ASUS\.codely\Default\tools\jdk-21.0.12.1+1`（清华 Adoptium 镜像下载） |
| Android SDK（platforms 33/34/35 + build-tools 34 + cmdline-tools） | `D:\Unity\Editor\Data\PlaybackEngines\AndroidPlayer\SDK`（Tuanjie 自带） |
| adb | `D:\Unity\Editor\Data\PlaybackEngines\AndroidPlayer\SDK\platform-tools\adb.exe` |

## 网络镜像（已配置进仓库，无需再动）

- Gradle 发行版：**腾讯镜像**（`android/gradle/wrapper/gradle-wrapper.properties`，用 -bin 省一半流量）
- Maven 依赖：**阿里云镜像**（`android/build.gradle`，google/public/gradle-plugin 三个仓库优先，原仓库兜底）
- SDK 许可证：已写入 Unity SDK 的 `licenses/` 目录（让 AGP 能静默自动补装缺失组件）

## 构建步骤

```powershell
# 1. web 产物（webp 已存在时可直接 next build 跳过压缩步骤）
npm.cmd run build
node scripts/slim-out.mjs        # 瘦身：删 assets 下有 webp 孪生的 png + 未引用的 out/games（439MB→98MB）

# 2. web 资产/插件有变化时同步
npx.cmd cap sync android

# 3. 出 Debug APK
$env:JAVA_HOME="C:\Users\ASUS\.codely\Default\tools\jdk-21.0.12.1+1"
$env:ANDROID_HOME="D:\Unity\Editor\Data\PlaybackEngines\AndroidPlayer\SDK"
Set-Location android
.\gradlew.bat assembleDebug
# 产物：android\app\build\outputs\apk\debug\app-debug.apk（约 46MB）
```

## 安装到手机

- USB：`adb.exe install -r app-debug.apk`
- 无线：把 APK 传到手机（微信/QQ 文件传输助手）后点击安装，需允许"安装未知来源应用"
- 要求：Android 6.0+（minSdk 23）

## 发布前待办（正式版）

1. **签名**：生成 keystore，在 `android/app/build.gradle` 配置 signingConfigs，出 release 包
2. **应用名与图标**：`capacitor.config.ts` 的 appName / `android/app/src/main/res/` 各密度图标与启动图
3. **包名**：`capacitor.config.ts` appId + `android/app/build.gradle` applicationId（当前为 `com.gufeng.city` 占位）
4. **上架合规**：软著、版号（含内购）、隐私政策
