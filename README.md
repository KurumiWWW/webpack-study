# Webpack

## 一、简介

> Webpack 是一个前端资源构建工具，静态模块打包器(module bundler)。它根据模块的依赖关系，经过打包生成对应的静态资源

### 1.打包流程

```
index.js
| jQuery less ... (静态模块)
| chunk(代码块)
| | [less->css][js->浏览器可编译的js]
| | 打包
| | bundle
```

### 2.五个核心

#### 2.1 Entry

入口：指示 Webpack 以哪个文件为入口进行打包，并分析其内部依赖关系

#### 2.2 Output

输出：指示 Webpack 打包后的 bundle 输出到哪个目录下，以及包名

#### 2.3 Loader

加载器：让 Webpack 处理非 js 文件（Webpack 本身只能处理 js 文件）

#### 2.4 Plugins

插件：比 Loader 执行的范围更广泛，插件的范围包括：从打包优化和压缩，一直到重新定义环境中的变量。

#### 2.5 Mode

模式：指示 Webpack 使用对应的模式进行配置
|模式|描述|特点|
|-|-|-|
|development 开发模式|会将 `process.env.NODE_ENV` 的值设为 `development`。启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`。|可以让代码进行本地调试的环境|
|production 生产模式|会将 `process.env.NODE_ENV` 的值设为 `production`。启用` FlagDependencyUsagePlugin`, `FlagIncludedChunksPlugin`, `ModuleConcatenationPlugin`, `NoEmitOnErrorsPlugin`, `OccurrenceOrderPlugin`, `SideEffectsFlagPlugin` 和 `UglifyJsPlugin`.|可以让代码优化上线的环境|

## 二、初次使用

### 1.index.js

> 入口起点文件

#### 1.1 运行指令

- 开发环境

```shell
webpack ./src/index.js -o ./build/built.js --mode=development
```

流程：`Webpack`以`./src/index.js`为入口进行打包，输出到`./build/built.js`。打包模式为开发环境

- 生产环境

```shell
webpack ./src/index.js -o ./build/built_product.js --mode=production
```

流程：`Webpack`以`./src/index.js`为入口进行打包，输出到`./build/built_product.js`。打包模式为生产环境，生产环境会压缩 js 代码

#### 1.2 结论

1.`webpack`可以处理`js/json`资源，不能处理`css/img`等资源 2.生产环境将 ES6 模块化编译成浏览器可识别的模块化 3.生产环境压缩了 js 代码

## 三、打包样式资源

> webpack.config.js

指示`webpack`的工作内容，当运行`webpack`指令时，会加载其中的配置
所有构建工具都是基于`nodejs`平台运行，模块化默认采用`commonjs`

```js
const { resolve } = require("path");
module.exports = {
  // webpack配置
  // 入口起点
  entry: "./src/index.js",
  // 输出
  output: {
    // 输出文件名
    filename: "built.js",
    // 输出路径-一般用绝对路径
    path: resolve(__dirname, "build"),
    // 每次打包清理之前遗留的文件
    clean: true,
  },
  // loader配置
  module: {
    rules: [
      // 详细loader配置
      // 不同文件必须配置不同的loader配置
      {
        // 匹配哪些文件
        test: /\.css$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左（从下到上）
          // 创建一个style标签，将js种的样式资源插入，添加到页面中
          "style-loader",
          // 将css文件编程commonjs模块加载到js中，里面内容是样式字符串
          "css-loader",
        ],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "scss-loader"],
      },
    ],
  },
  // plugins配置
  plugins: [
    // 详细plugins配置
  ],
  // 模式
  mode: "development",
  // mode: "production"
};
```

## 四、打包 HTML 资源

- Loader: 下载 -> 配置
- Plugins: 下载 -> 引入 -> 配置

> webpack.config.js

```js
// 引入
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  /* ... */
  plugins: [new HtmlWebpackPlugin()],
  /* ... */
};
```

> html-webpack-plugin

默认创建一个空的 HTML，自动引入打包输出的所有资源
如果需要指定某个有结构的 HTML 文件：

```js
new HtmlWebpackPlugin({
  // 复制该文件，并自动引入打包输出的所有资源
  template: "./src/index.html",
});
```

## 五、打包图片资源

**`webpack5`已禁用 url-loader**

> webpack.config.js

```js
module.exports = {
  /* ... */
  module: {
    rules: {
      test: /\.(jpg|png|gif)$/,
      type: "asset",
      parser: {
        dataUrlCondition: {
          // 小于8kb会转成base64
          maxSize: 8 * 1024,
        },
      },
    },
    rules: {
      // html-loader负责处理html文件中的引入
      test: /\.html$/,
      loader: "html-loader",
    },
  },
  /* ... */
};
```

## 六、开发环境配置

### 1.使用 source map

> webpack.config.js

```js
module.exports = {
  /* ... */
  devtool: "inline-source-map",
  /* ... */
};
```

配置`inline-source-map`后，浏览器可以查找到原本的 `js` 文件代码，而非`webpack`打包后的代码

### 2.使用 watch mode

打包时使用命令：

```shell
webpack --watch
```

开启 watch mode，使 webpack 能够监听代码的修改从而自动进行响应式的打包操作
