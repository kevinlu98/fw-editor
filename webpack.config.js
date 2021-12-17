const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => ({
    mode: 'development',

    entry: path.join(__dirname, 'src', 'scripts', 'fw.editor.js'),

    output: {
        path: path.join(__dirname, 'dist'),
        filename: "fw.editor.js",
        libraryTarget: 'umd',
        library: 'Freewind'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'index.html')
        })
    ],
    devServer: {
        port: 8000,
        static: path.join(__dirname)
    }
})