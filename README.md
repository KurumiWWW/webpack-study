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

## 七、Babel loader

### 1.用途

在开发过程中，一定会用到 ES6 语法，而当`webpack`对项目进行打包时，ES6 相关代码会原封不动地输出，如果浏览器不支持 ES6 语法，则会出现错误。

这时便需要使用到`babel-loader`，将`babel`和`webpack`进行结合

### 2.使用

安装：

```shell
npm install -D babel-loader @babel/core @babel/preset-env
```

- **babel-loader**:在`webpack`中应用`babel`解析`ES6`的桥梁
- **@babel/core**:babel 核心模块
- **@babel/preset-env**:babel 预设，一组 babel 插件的集合

配置：

```js
rules: [
  {
    test: /\.js$/,
    // 对除了nodemodules以外的代码进行编译
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  },
];
```

### 3. Error : regeneratorRuntime is not defined

`regeneratorRuntime `用于在 babel 编译中兼容`async/await`

需要额外添加两个库

- **@babel/runtime** 包含了 `regeneratorRuntime ` 运行时需要的内容
- **@babel/plugin-transform-runtime** 在需要`regeneratorRuntime `的地方自动`require`导包

配置

```js
rules: [
  {
    test: /\.js$/,
    // 对除了nodemodules以外的代码进行编译
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        // 添加这个插件
        plugins: ["@babel/plugin-transform-runtime"],
      },
    },
  },
];
```

## 八、代码分离

把多个模块共享的代码分离出去，减少入口文件大小，提高首屏加载速度

常见的代码分离方法:

- **入口起点**：使用`entry`配置，手动的分离代码；
- **防止重复**：使用 `Entry dependencies` 或者`SplitChunkPlugin`去重和分离代码；
- **动态导入**：通过模块内联函数调用分离代码

### 1.入口起点

```js
module.exports = {
  // 多入口
  entry: {
    index: "./src/index.js",
    another: "./src/another.js",
  },
  output: {
    // 按照entry中的key命名
    filename: "[name].bundle.js",
    path: resolve(__dirname, "build"),
    clean: true,
  },
};
```

打包后的目录：

```
another.bundle.js
index.bundle.js
index.html
```

**缺点**：如果两个入口都对某个包进行引入（公共模块，如`lodash`等），那么导出的每个`chunk`都会对引用的包进行导入，造成代码冗余

### 2.防止重复

针对代码冗余，修改后的配置：

```js
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "shared",
    },
    another: {
      import: "./src/another.js",
      dependOn: "shared",
    },
    shared: "lodash",
  },
```

**含义**：如果`index`与`another`都含有`lodash`模块的话，将其抽离出来，创建名为`shared`的`chunk`

打包后的目录：

```
another.bundle.js
index.bundle.js
index.html
shared.bundle.js
```

**使用 webpack 内置插件：split-chunks-plugin**

可以自动抽离公共代码

```js
entry: {
  index: "./src/index.js",
  another: "./src/another.js",
}
```

```js
optimization: {
  splitChunks: {
    chunks: "all",
  },
}
```

### 3.动态导入

```js
function getComponent() {
  return import("lodash").then(({ default: _ }) => {
    const element = document.createElement("div");
    element.innerHTML = _.join(["hello", "webpack"], " ");
    return element;
  });
}
```

利用`import`函数进行动态导入模块，打包后，模块会被拆分为一个单独的`chunk`

**动态-静态混合导入**

需要在配置中添加

```js
splitChunks: {
  chunks: "all",
}
```

### 4.懒加载

利用`import`方法实现`js`文件的懒加载

```js
const button = document.createElement("button");
button.textContent = "加法";
button.addEventListener("click", () => {
  // 魔法注释 用于更改导出后包的命名
  import(/*webpackChunkName:"math"*/ "./math.js").then(({ add }) => {
    console.log(add(1, 2));
  });
});
document.body.appendChild(button);
```

在开发者工具中`Network`可以看到，点击按钮前，并未调用`math.js`文件，点击按钮调用`add`方法时，才调用了该文件，实现了懒加载

### 5.预获取/预加载模块

声明`import`时，使用以下内置指令，让`webpack`输出“`resource hint`资源提示”，告知浏览器：

- **prefetch** 预获取：将来某些导航下可能需要的资源
- **preload** 预加载：当前导航下可能需要的资源

#### 5.1 prefetch

在`import`时，添加注释

```js
import(/* webpackPrefetch: true* / "./math.js").then(()=>{})
```

打包后，页面头部标签里会加入一个`link`元素，预获取了打包后的`math.js`

```html
<link rel="prefetch" as="script" href="http://127.0.0.1:5500/8.%E4%BB%A3%E7%A0%81%E5%88%86%E7%A6%BB/build/math.bundle.js">
```

效果：在页面内容加载完毕，网络空闲时，加载`math.bundle.js`

#### 5.2 preload

```js
/*webpackPreload: true*/
```

效果类似懒加载。



**最优方案：使用prefetch预获取**



## 九、缓存

每次访问网站，浏览器获取服务器上的前端资源都会消耗时间，所以浏览器通常会自带缓存技术，利用缓存，降低网络请求流量，以使网站加载速度更快。

但是，浏览器缓存是**通过文件名判断**，发包后文件名没有更改，浏览器会使用已缓存的版本渲染，对用户和开发都不够友好。

### 1.输出文件名

利用`contenthash`:根据文件内容生成`hash`来修改文件名

```js
output:{
	filename: "[name].[contenthash].js"
}
```

### 2.缓存第三方库

一般采取将第三方库提取到单独的`vendor chunk`文件中的方法。

第三方库很少像本地代码一样频繁修改，通过以上步骤，利用`client`长效缓存机制，命中缓存从而消除请求，减少向服务器获取资源的同时，还能保证客户端、服务端代码版本一致。

简单来说，就是将第三方代码单独缓存到浏览器，只有本地代码更新时，浏览器缓存才会更新，而第三方库始终可以使用浏览器缓存的。

将`node_modules`路径下所有的库打包进`vendors.js`中：

```js
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
```

## 十、拆分环境配置

### 1.公共路径

服务器静态资源存放路径：影响打包后的`index.html`文件中路径的引入（默认使用相对路径引入）

```js
output:{
  publicPath:"http://localhost:8080/"
}
```

### 2.环境变量

配置中的`module.exports`可以定义为函数，有默认的参数，参数为当前的环境变量

````js
module.exports = env => {
  return {
    // 各种webpack配置
  }
}
````

在输入命令行进行打包时，用户可以自己输入环境变量

```shell
npx webpack --env production --env name="apple"
```

此时，打印函数中的`env`可以得到

```js
{
  WEBPACK_BUNDLE: true,
  WEBPACK_BUILD: true,
  production: true,
  name: 'apple'
}
```

根据用户输入的环境变量，对配置做出相应的改变，如打包模式

```js
mode: env.production? "production" : "development"
```

> 注意：此时生产环境打包后，js代码并没有被折叠，是因为引入了CssMinimizerPlugin。需要再引入一个js的minimizer插件：terser-webpack-plugin并进行实例化

### 3.拆分配置文件

如果所有环境都在同一个配置文件中，就只能通过2中的方法，使用逻辑判断语句，判断环境变量达到修改配置的目的，如果各环境打包方式区别很大，这样的方法管理起来会十分棘手，就需要针对各环境，对配置文件进行拆分。

