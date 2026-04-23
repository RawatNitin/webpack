const { merge } = require('webpack-merge');
const common = require("./webpack.common");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// -----------------------------------------------------------------------------
// webpack.prod.js
// -----------------------------------------------------------------------------
// Production-focused configuration merged on top of webpack.common.js.
// Goals in prod:
// - Smaller/faster assets
// - Long-term browser caching
// - Stable chunking strategy so users download fewer changed files
// -----------------------------------------------------------------------------
module.exports = merge(common, {
    // Enables webpack's production defaults (minification + optimizations).
    mode: "production",
    output: {
        // Add content hash so browser can cache aggressively.
        // File name changes only when file content changes.
        filename: "[name].[contenthash].bundle.js"
    },
    optimization: {
        // Split shared/vendor code into separate chunks.
        // This improves caching because app code changes won't always invalidate
        // large third-party bundles.
        splitChunks: {
            chunks: "all"
        },
        // Put webpack runtime/manifest into a separate small chunk.
        // This helps keep other chunk hashes stable across builds.
        runtimeChunk: "single"
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Emit CSS as real files (instead of injecting via JS).
            // Hashed names support cache busting.
            filename: "[name].[contenthash].css"
        })
    ],
    module: {
        rules: [
            {
                // Handle SCSS pipeline for production.
                test: /\.scss$/i,
                use: [
                    // Loader execution order is LAST -> FIRST:
                    // 1) sass-loader compiles SCSS -> CSS
                    // 2) css-loader resolves imports/url and builds module graph
                    // 3) MiniCssExtractPlugin extracts CSS into standalone file
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                // Suppress third-party warning noise.
                                quietDeps: true,
                                // Temporary suppression for dependency @import deprecations.
                                silenceDeprecations: ["import"]
                            }
                        }
                    }
                ],
            }
        ]
    }
});

