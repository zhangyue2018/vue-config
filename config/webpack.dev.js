const path = require('path');
const { DefinePlugin } = require('webpack');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

// 返回处理样式loader的函数
const getStyleLoaders = (pre) => {
    return [
        'vue-style-loader', // 自带处理css的热更新
        'css-loader',
        {
            // 处理css兼容性问题
            // 配合package.json中的browserslist来指定兼容性（做到什么程度）
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env']
                }
            }
        },
        pre
    ].filter(Boolean);
}


module.exports = {
    entry: './src/main.js',
    output: {
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
    },
    module: {
        rules: [
            // 处理css
            {
                test: /\.css$/,
                use: getStyleLoaders(),
            },
            {
                test: /\.less$/,
                use: getStyleLoaders("less-loader"),
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders("sass-loader"),
            },
            // 处理图片
            {
                test: /\.(jpe?g|gif|png|webp|svg)/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    }
                }
            },
            {
                test: /\.(woff2?|ttf)$/,
                type: 'asset/resource'
            },
            // 处理js
            {
                test: /\.js$/,
                include: path.resolve(__dirname,'../src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true, // 开启缓存
                    cacheCompression: false, // 不开启压缩
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader', // 自带处理js的热更新
            }
        ]
    },
    plugins: [
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, '../src'), // 指定文件根目录
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new VueLoaderPlugin(),
        // cross-env定义的环境变量给打包工具使用
        // DefinePlugin定义的环境变量给源代码使用,从而解决vue3页面警告的问题
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: (entryPoint) => `runtime~${entryPoint.name}`
        }
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"]
    },
    devServer: {
        host: 'localhost',
        port: 3002,
        open: true,
        hot: true, // 开启HMR
        historyApiFallback: true, // 解决前端路由刷新404问题
    }
}