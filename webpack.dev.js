const { merge } = require('webpack-merge');
const common = require("./webpack.common");
const path = require("path");

// -----------------------------------------------------------------------------
// webpack.dev.js
// -----------------------------------------------------------------------------
// Development-focused configuration merged on top of webpack.common.js.
// Goals in dev:
// - Fast incremental rebuilds
// - Easy debugging
// - Good local developer experience (auto-open, HMR/live updates)
// -----------------------------------------------------------------------------
module.exports = merge(common, {
    // Enables webpack's development defaults:
    // - unminified output
    // - more useful warning messages
    // - faster compile strategy than production mode
    mode: "development",
    // Source maps map bundled code back to original source in devtools.
    // `eval-cheap-module-source-map` is a common fast dev choice.
    devtool: "eval-cheap-module-source-map",
    // Keep filenames stable and readable during development.
    // Hashes are avoided in dev for speed and clarity.
    output: {
        filename: "[name].bundle.js"
    },
    // Local dev server behavior.
    devServer: {
        // Serve static content from `dist`.
        // For webpack-dev-server this is usually in-memory plus static fallback.
        static: {
            directory: path.resolve(__dirname, "dist")
        },
        // Hot Module Replacement:
        // updates changed modules without full page reload (where possible).
        hot: true,
        // Open browser automatically when server starts.
        open: true
    },
    module: {
        rules: [
            {
                // Apply this loader chain to .scss files.
                test: /\.scss$/i,
                use: [
                    // Loader order runs from LAST -> FIRST:
                    // 1) sass-loader compiles SCSS -> CSS
                    // 2) css-loader resolves imports/url and turns CSS into module
                    // 3) style-loader injects CSS into the page at runtime
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                // Suppress noisy warnings from dependencies you don't control.
                                quietDeps: true,
                                // Silence known Sass @import deprecation warnings temporarily.
                                // Useful while older libs (e.g. Bootstrap 4) still use @import.
                                silenceDeprecations: ["import"]
                            }
                        }
                    }
                ],
            }
        ]
    }
});

// Notes:
// - `style-loader` is preferred in development because updates appear instantly.
// - In production, you generally extract CSS into real files
//   (see MiniCssExtractPlugin usage in webpack.prod.js).

