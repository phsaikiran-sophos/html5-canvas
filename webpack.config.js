const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    context: __dirname,
    devtool: 'inline-source-map',
    entry: [
        './src/ts/main.ts',
        path.resolve(__dirname, 'src/scss/styles.scss')
    ],
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {outputPath: 'css/', name: '[name].css'}
                    },
                    "sass-loader"
                ]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "js/[name].js",
    },
    resolve: {
        extensions: ['.ts']
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'src/index.html'),
                    to: path.resolve(__dirname, 'build/index.html')
                },
                {
                    from: path.join(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'build/favicon.ico')
                }
            ],
            options: {
                concurrency: 100,
            },
        }),
    ]
};
