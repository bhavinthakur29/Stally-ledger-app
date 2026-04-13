module.exports = function (api) {
  api.cache(() => process.env.NODE_ENV ?? 'development');
  const isProd = api.env('production');

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      ...(isProd ? ['transform-remove-console'] : []),
      'react-native-reanimated/plugin',
    ],
  };
};
