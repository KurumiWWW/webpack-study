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

## 三、打包 HTML 资源

- Loader: 下载 -> 配置
- Plugins: 下载 -> 引入 -> 配置

> webpack.config.js

```js
// 引入
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  /* ... */
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // 入口html
      filename: "app.html", // 出口html
      inject: "body", // 在指定标签中生成script标签
    }),
  ],
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

## 四、开发环境配置

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

### 3.使用 webpack-dev-server

安装 `webpack-dev-server`

```shell
npm i webpack-dev-server -D
```

使用`webpack-dev-server`启动项目

```shell
npx webpack-dev-server
```

使用`webpack-dev-server`能够实现项目代码实时更新，提高开发效率与`webpack`的编译效率

## 五、资源模块

### 1.简介

资源模块`asset module`

资源模块允许`webpack`打包其他类型的资源文件

资源模块类型`asset module type`通过四种新的类型模块替换所有的`loader`

四种类型：

1. `asset/resource` 发送一个单独的文件并导出`URL`
2. `asset/inline`导出资源的`uri`
3. `asset/source`导出资源的源代码
4. `asset`会在导出单独文件或导出`uri`之间自动进行选择

### 2.resource 资源

打包`png`类型资源

```js
module: {
    rules: [
        {
            test: /\.png$/,
            type: "asset/resource",
        },
    ],
},
```

#### 指定资源输出目录及文件名

1. 在`output`中定义

```js
output: {
  assetModuleFilename: "image/test.png"; // 输出至打包路径下的image目录中，命名为test.png
}
```

```js
output: {
  assetModuleFilename: "image/[contenthash][ext]"; // 输出至打包路径下的image目录中，命名为webpack自动生成的hash，后缀为原文件后缀
}
```

2. 在`generator`中定义

```js
rules: [
  {
    test: /\.png$/,
    type: "asset/resource",
    generator: {
      filename: "images/[contenthash][ext]",
    },
  },
];
```

**对于相同的配置，如同时在`generator`和`output`中定义图片输出路径，将以后面定义的为准**

### 3.inline 资源

```js
rules: [
  {
    test: /\.svg$/,
    type: "asset/inline",
  },
];
```

使用`inline`打包的图像文件不会出现在`dist`目录下

文件会以`base64`的形式直接添加在`html`文件中

### 4.source 资源

```js
rules: [
  {
    test: /\.txt$/,
    type: "asset/source",
  },
];
```

可以直接将`txt`文件中的文字（源代码）添加到`html`容器中

### 5.asset 自动解析

```js
rules: [
  {
    test: /\.jpg$/,
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: 4 * 1024 * 1024, // 文件大于4M生成资源，否则生成base64
      },
    },
  },
];
```

## 六、Loader

### 1.加载样式文件

#### 1.1 加载原生 CSS

```js
rules: [
    {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // 先使用css-loader识别css文件，再使用style-loader将样式放入文件
    },
],
```

`webpack`不能直接打包样式文件，引入`css`样式后，如要使用`loader`用来加载样式文件

加载`css`，需要使用`style-loader`与`css-loader`

`use`数组中的`loader`会按照**从后向前的顺序**加载：**链式逆序加载**

#### 1.2 加载预处理器

```js
rules: [
    {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        // 先使用sass-loader将sass转换成css，然后使用css-loader识别css文件，再使用style-loader将样式放入文件
    },
],
```

### 2.抽离和压缩样式文件

#### 2.1 抽离样式

> 安装插件 mini-css-extract-plugin

```shell
npm i mini-css-extract-plugin -D
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
```

将原本的`style-loader`替换成了`mini-css-extract-plugin`插件的`loader`

执行打包命令后，在输出目录下生成了一个`css`文件，，并且引入到了目标`html`文件中

#### 2.2 压缩样式

> 安装插件 css-minimizer-webpack-plugin

```shell
npm i css-minimizer-webpack-plugin -D
```

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  // 打包模式需为production
  mode: "production",
  // 在优化配置中加载该插件，而不是plugins中
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
```

执行打包命令后，输出目录下生成了压缩后的样式文件

### 3.加载字体文件

```js
rules: [
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    type: "asset/resource",
  },
];
```

`asset/resource`可以加载任何类型的资源

### 4.加载数据

- JSON：Nodejs 本身支持，可直接加载；

- XML：安装 `xml-loader`

  ```shell
  npm i xml-loader -D
  ```

  加载后，转化为 js 对象形式；

- CSV/TSV：安装`csv-loader`

  ```shell
  npm i csv-loader -D
  ```

  加载后，转为数组形式。

- toml/yaml/json5: 安装`toml` `yaml` `json5`

  ```shell
  npm i toml yaml json5 -D
  ```

  ```js
  const toml = require("toml");
  const yaml = require("yaml");
  const json5 = require("json5");

  module.exports = {
    /*...*/
    rules: [
      {
        test: /\.toml$/,
        type: "json",
        parser: {
          parse: toml.parse,
        },
      },
      // 其余同理
    ],
    /*...*/
  };
  ```
