module.exports = {
  // mode: 'production',
  //  ビルドしたときのパス 空文字にして相対パスにする。
  baseUrl: process.env.NODE_ENV === 'production'
    ? ''
    : ''
};
