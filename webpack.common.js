const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// -----------------------------------------------------------------------------
// webpack.common.js
// -----------------------------------------------------------------------------
// This file contains the "base" webpack configuration that is used by BOTH
// development and production builds.
//
// Idea:
// - Put shared settings here (entry, generic output shape, common loaders).
// - Keep environment-specific concerns (dev server, hashing strategy, CSS
//   extraction, heavy optimizations) in webpack.dev.js / webpack.prod.js.
//
// This keeps config easy to reason about and avoids duplicating settings.
// -----------------------------------------------------------------------------
module.exports = {
    // `entry` tells webpack where the dependency graph starts.
    // Here we define two entry points:
    // - `main`: your application code
    // - `vendor`: third-party/library imports you want split separately
    //
    // Output files are named with [name], so this generates:
    // - main.bundle.js
    // - vendor.bundle.js
    entry: {
       main: "./src/index.js",
       vendor: "./src/vendor.js"
    },
    output: {
        // Absolute path where build artifacts are written.
        path: path.resolve(__dirname, "dist"),
        // Remove old files in `dist` before writing new ones (webpack 5 feature).
        clean: true,
        // Default JS output naming. Dev/prod can override this.
        filename: "[name].bundle.js",
        // When images/assets are emitted, place them in `dist/imgs`.
        // `contenthash` changes only when file content changes -> long-term caching.
        assetModuleFilename: "imgs/[name].[contenthash][ext][query]"
    },
    module: {
        // `rules` define how webpack should process non-JS modules.
        rules: [
            {
                // Process imported HTML files.
                test: /\.html$/,
                use:[
                    // `html-loader` lets webpack understand:
                    // - <img src="...">
                    // - other asset references inside HTML
                    // so those files can be included in the build graph.
                    "html-loader"
                ]
            },
            {
                // Match common image formats.
                test: /\.(svg|png|jpg|gif)$/,
                // `asset/resource` emits a separate file and returns its public URL.
                // Equivalent to old file-loader behavior in webpack 4.
                type: "asset/resource"
            }
            
        ]
    },
    plugins: [
        // Generates `dist/index.html` from the template.
        // Webpack automatically injects generated <script> tags for bundles.
        // This avoids manually updating script names when hashes change.
        new HtmlWebpackPlugin({
            template: "./src/template.html"
        })
    ]
};

