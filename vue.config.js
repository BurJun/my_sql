const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
   publicPath: '/my_sql/', 
  devServer: {
    host: 'localhost',  // Либо '0.0.0.0' для доступа из других сетей
    port: 8080,         // Порт, на котором будет запущен сервер
    hot: true,          // Включает горячую перезагрузку модулей
    liveReload: true,   // Включает live-reload, чтобы обновлять страницу при изменениях
    open: true,         // Автоматически открывает браузер при запуске сервера
  }
});
