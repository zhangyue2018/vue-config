const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 提取css成单独文件
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // css压缩
const TerserWebpackPlugin = require('terser-webpack-plugin'); // js代码压缩
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin'); // 图片压缩
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack');

// 返回处理样式loader的函数
const getStyleLoaders = (pre) => {
    return [
        MiniCssExtractPlugin.loader,
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
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/[name].[contenthash:10].js',
        chunkFilename: 'static/js/[name].[contenthash:10].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]',
        clean: true,
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
                loader: 'vue-loader',
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
            // favicon: path.resolve(__dirname, '../public/favicon.ico'),
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: 'static/css/[name].[contenthash:10].chunk.css',
        }),
        new ImageMinimizerWebpackPlugin({
            minimizer: {
                implementation: ImageMinimizerWebpackPlugin.imageminGenerate,
                options: {
                    plugins: [
                        ['gifsicle', { interlaced: true }],
                        ['jpegtran', { progressive: true }],
                        ['optipng', {optimizationLevel: 5 }],
                        [
                            "svgo", {
                                plugins: [
                                    "preset-default",
                                    "prefixIds",
                                    {
                                        name: 'sortAttrs',
                                        params: {
                                            xmlnsOrder: 'alphabetical',
                                        }
                                    }
                                ],
                            }
                        ]
                    ],
                }
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../public'),
                    to: path.resolve(__dirname, '../dist'),
                    globOptions: {
                        // 忽略index.html文件
                        ignore: ["**/index.html"]
                    }
                }
            ],
        }),
        new VueLoaderPlugin(),
        // cross-env定义的环境变量给打包工具使用
        // DefinePlugin定义的环境变量给源代码使用,从而解决vue3页面警告的问题
        new DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
        }),
    ],
    mode: 'production', // 在production环境下，html会自动进行压缩
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        runtimeChunk: {
            name: (entryPoint) => `runtime~${entryPoint.name}`
        },
        minimizer: [
            new CssMinimizerWebpackPlugin(), // css的压缩
            new TerserWebpackPlugin(), // js代码压缩
        ],
    },
    // webpack解析模块加载选项
    resolve: {
        // 自动补全文件扩展名
        extensions: [".vue", ".js", ".json"]
    }
}