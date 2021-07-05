const path = require("path");

module.exports = {
    // mode: "development", // by default webpack builds in production mode, so development is specified here explicitly.ˀ development mode doesn't minify code
    entry: {
       main: "./src/index.js",
       vendor: "./src/vendor.js"
    },
    // output: {
        // filename: "main.[chunkhash].js", // cache-busting: creates a dynamic name everytime something is changed in the index.js or other code files. To point to this dynamic named script file to the index.html we need to use HtmlWebpackPlugin
        // path: path.resolve(__dirname, "dist")
    // },
    module: {
        // loaders are used by webpack to handle different types of files besides javascript. How different types of files are to be pre-processed as they are loaded
        rules: [
            {
                test: /\.html$/,
                use:[
                    "html-loader" // if it encounters any <img> tag in html file, then it automatically creates a require statement for that image source in javascript. But Webpack still doesn;t know what to do with this required image or file
                ]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use:{
                    loader: "file-loader", // any file requried by above html-loader is of specified extensions (svg|png|jpg|gif), then create a file with name specified in "options" below and place it in the "outputPath" folder inside dist. Also changes the src of that image to the new path pointing to "outputPath" created in dist folder
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "imgs"
                    }
                }
            }
            
        ]
    }
};

