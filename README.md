##### manifest.json 配置说明

```json
{
  "name": "vue-chrome-template",
  "description": "vue-chrome-template project",
  "version": "1.0",
  "manifest_version": 2,
  // 权限说明
  "permissions": [
    "tabs",
    "activeTab",
    "cookies",
    "storage",
    "<all_urls>",
    "*://*/*",
    "contextMenus",
    "notifications"
  ],
  // 浏览器右上角图标
  "browser_action": {
    "default_title": "vue-chrome-template",
    "default_popup": "./index.html"
  },
  // 背景页
  "background": {
    "page": "./pages/background/index.html"
  },
  // 插件选项配置页
  "options_page": "./pages/options/index.html",
  // 覆盖特定页面
  "chrome_url_overrides": {
    "newtab": "./index.html", // 新开标签页
    "history": "history.html", // 历史记录页
    "bookmarks": "bookmarks.html" // 书签管理页
  }
}
```

##### 其他

插件实现 Demo：https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html#%E5%86%99%E5%9C%A8%E5%89%8D%E9%9D%A2

插件 API：http://chrome.cenchy.com/manifest.html
