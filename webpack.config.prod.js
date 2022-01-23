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
            },
            {
                test: /\.ts$/,
                exclude: [
                    path.resolve(__dirname, 'excluded_file_name.js')
                ],
                enforce: 'post',
                use: {
                    loader: WebpackObfuscator.loader,
                    options: {
                        splitStrings: true,
                        splitStringsChunkLength: 8
                    }
                }
            },
        ]
    },
    resolve: {
        extensions: ['.ts', ".js"]
    },
    plugins: [new HtmlWebpackPlugin({
        title: 'Balls',
        template: 'src/index.html'
    })]
};