const { merge } = require('webpack-merge');
const common = require("./webpack.common");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development", // by default webpack builds in production mode, so development is specified here explicitly.ˀ development mode doesn't minify code
    // entry: "./src/index.js",
    output: {
        filename: "[name].bundle.js", // cache-busting: creates a dynamic name everytime something is changed in the index.js or other code files. To point to this dynamic named script file to the index.html we need to use HtmlWebpackPlugin
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.scss$/i, // match all files which end with .scss
                use: [
                    "style-loader", // 3. it takes the converted javscript from css loader and places it in the minfied javascript files and then applies it to DOM by injecting script tag 
                    "css-loader",   // 2. takes processed css files to convert them to javscript but doesn't apply it to DOM
                    "sass-loader"   // 1. pre-processes scss files to css
                ], // use these loaders to preprocess those files
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin(
            {
                template: "./src/template.html" // Tells which template to use to create index.html in dist folder. This is optional
            }
        ) // This plugin by default creates a index.html file in the dist folder and dynamically appends a script tag to that html (index.html) file with <output.filename> as the src, so that the dynamically created main.[chunkhash].js file is included in the final bundle.
    ]
});

// ************** style-loader VS MiniCssExtractPlugin  *************

// style-loader takes the converted javscript from css loader and places it in the minfied javascript file. In this scenario while loading DOM there is no style tag encountered and style is applied after DOM has loaded and all the js files have loaded. So, there is a flicker on the screen. To avoid this MiniCssExtractPlugin is used.

// MiniCssExtractPlugin takes the converted javscript from CSS loader and creates a css file and then injects a style tag in the DOM pointing it to that CSS. This way while rendering the DOM styke tag is encountered and styles are applied simultaneously and flickering is not experienced.

