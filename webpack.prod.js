const { merge } = require('webpack-merge');
const common = require("./webpack.common");
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "production", // by default webpack builds in production mode, so production is specified here explicitly. development mode doesn't minify code
    output: {
        filename: "[name].[chunkhash].bundle.js", // cache-busting: creates a dynamic name everytime something is changed in the index.js or other code files. To point to this dynamic named script file to the index.html we need to use HtmlWebpackPlugin
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
         minimizer:[
            new OptimizeCSSAssetsWebpackPlugin(), // For CSS
            new TerserWebpackPlugin(), // For JS
            new HtmlWebpackPlugin(
                {
                    template: "./src/template.html", // Tells which template to use to create index.html in dist folder. This is optional
                    removeAttributeQuotes:true,
                    collapseWhiteSpace: true,
                    removeComments: true
                }
            ) // This plugin by default creates a index.html file in the dist folder and dynamically appends a script tag to that html (index.html) file with <output.filename> as the src, so that the dynamically created main.[chunkhash].js file is included in the final bundle.ˀ
         ]
    }, // If we use minimizer array, in that case it overwrites the default javascript minifying setting to false even if mode used is production
    plugins: [
        new MiniCssExtractPlugin({
            name: "[name].[hash].css"
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/i, // match all files which end with .scss
                use: [
                    MiniCssExtractPlugin.loader, // 3. Creates CSS files in the dist folder and injects style tag in the DOM.
                    // it takes the converted javscript from CSS loader and creates a css file and then injects a style tag in the DOM pointing it to that CSS. 
                    "css-loader",   // 2. takes processed css files to convert them to javscript but doesn't apply it to DOM
                    "sass-loader"   // 1. pre-processes scss files to css
                ], // use these loaders to preprocess those files
            }
        ]
    }
});

