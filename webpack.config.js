const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const MODE_DEV = process.env.NODE_ENV === 'development'
const MODE_PROD = process.env.NODE_ENV === 'production'

function optimization() {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (MODE_PROD) {
        config.minimizer = [
            new TerserWebpackPlugin(),
            new CssMinimizerPlugin()
        ]
    }

    return config
}

function filename(ext) {
    return MODE_DEV ? `[name].${ext}` : `[name].[hash].${ext}`
}

function assetModuleFilename(folder) {
    return MODE_DEV ? `assets/${folder}/[name][ext]` : `assets/${folder}/[name].[hash][ext]`
}

module.exports = {

    context: path.resolve(__dirname, 'src'),
    mode: 'development',

    // Точка входа JavaScript-файлов
    entry: {
        main: './index.js',
    },

    // Точка выхода JavaScript-файлов
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'public'),
        assetModuleFilename: assetModuleFilename(''),
        clean: true
    },

    optimization: optimization(),

    devServer: {

        static: {

            directory: path.join(__dirname, 'src'),

        },

        compress: true,
        hot: true,
        port: 9000,

    },

    devtool: MODE_DEV ? 'source-map' : undefined,

    plugins: [

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html'),
        }),

        new MiniCSSExtractPlugin({
            filename: filename('css')
        }),
    ],

    resolve: {

        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.csv', '.less', '.pug', '.css', '.scss', '.png', '.jpeg', '.jpg', '.webp'],

        // alias: {
        //     '@images': path.resolve(__dirname, 'src/assets/images')
        // }
    },

    module: {
        rules: [

            // HTML
            {
                test: /\.html?$/i,
                use: ['html-loader']
            },

            // CSS
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                    },
                    'css-loader'
                ],
            },

            // SCSS
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                    },
                    'css-loader',
                    'sass-loader'
                ],
            },

            // LESS
            {
                test: /\.less$/i,
                use: [
                    {
                        loader: MiniCSSExtractPlugin.loader,
                    },
                    'css-loader',
                    'less-loader'
                ],
            },

            // TypeScript
            {
                test: /\.([cm]?ts|tsx)$/, 
                loader: "ts-loader"
            },

            // Images
            {
                test: /\.(png|svg|jpe?g|webp|gif|)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `${assetModuleFilename('images')}`
                }
            },

            // Fonts
            {
                test: /\.(woff2?|ttf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `assets/fonts/${filename('[ext]')}`
                }
            },

            // Video
            {
                test: /\.(mp4|avi|wmv|m[ok]v|flv|webm|mpeg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `${assetModuleFilename('videos')}`
                }
            },

            // Audio
            {
                test: /\.(mp3|wav|aac|flac|wma|ogg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: `${assetModuleFilename('audio')}`
                }
            }
        ]
    }
}
