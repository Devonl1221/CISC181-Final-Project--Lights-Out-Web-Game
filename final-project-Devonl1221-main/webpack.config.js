const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const css = require("css-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },

    module: {
        rules: [
            {
                test: /\.html$/i,
                use: [
                    {
                        loader: "raw-loader",
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
            // TypeScript
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            // CSS
            {
                test: /src[\/|\\].+\.css$/i,
                use: ["raw-loader"],
            },
            {
                test: /^((?!src[\/|\\]).)*.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    entry: {
        main: path.resolve(__dirname, "./wbcore/start.ts"),
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: "assets", to: "assets" }],
        }),
        new HtmlWebpackPlugin({
            title: "webpack Boilerplate",
            template: path.resolve(__dirname, "./src/index.html"), // template file
            filename: "index.html", // output file
        }),
    ],
    devtool: "source-map",
};
