import WebExtPlugin from 'web-ext-plugin';
import path from 'path';
import {fileURLToPath} from 'url';
import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new CopyPlugin({
            patterns: [
                {from: "src/manifestFirefox.json", to: "manifest.json"},
            ],
        }),
        new WebExtPlugin({})],
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        // Add `@/...` as a valid path to import from
        alias: {
            "@/": path.resolve(__dirname, "src/"),
        },
    }
};