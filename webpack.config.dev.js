const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const WebpackObfuscator = require("webpack-obfuscator");

module.exports = {
    entry: "./src/app.ts",
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', ".js"]
    },
    plugins: [new HtmlWebpackPlugin({
        title: 'Balls',
        template: 'src/index.html'
    })],
    watch: true
};