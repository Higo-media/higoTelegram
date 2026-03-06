module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5, // 对应 375px 的设计稿，NutUI 默认也是这个基准
            propList: ['*'],
        },
    },
};
