# gulp-starter
Установка сех плагинов gulp:
1. npm i gulp gulp-sass gulp-autoprefixer gulp-minify-css gulp-uglify gulp-rigger gulp-imagemin imagemin-pngquant rimraf gulp-sourcemaps gulp-rename gulp-plumber gulp-watch gulp-sftp -D
2. npm install browser-sync gulp --save-dev
3. npm install --save-dev gulp-useref

develop                     - корневой каталог разработки
└─start                     - каталог проекта
 ├─build                    - билд собраный таск-менеджером
 ├─resource                 - все файлы исходники для разработки (.psd и пр.)
 ├─src                      - каталог разработки
 │├─css                     - каталог разработки стилей
 ││├─images                 - все статичные изображения
 ││├─sprites                - изображение собираемые в спрайт
 ││├─partial                - пользовательские файлы стилей
 │││├─mixins.styl           - пользовательские миксины
 │││└─styles.styl           - пользовательские стили
 ││├─vendor                 - прочие внешние файлы стилей
 ││└─styles.styl            - основной файл стилей
 │├─fonts                   - каталог шрифтов
 │├─img                     - каталог динамических изображений
 │├─js                      - каталог разработки JavaScript
 ││├─_*.js                  - побочные файлы js
 ││├─_app.js               - основной пользовательский js
 ││└─main.js                - основной файл js
 │├─.htaccess               - конфиг для сервера
 │├─*.html                  - файлы разметки страницы
 │├─pages.html              - файл со ссылками на все страницы шаблона
 │├─index.html              - индексовый файл разметки страницы
 │└─include                 - каталог подключаемых файлов разметки
 │ └─*.html                 - подключаемые файлы разметки (header.html и пр.)
 ├─package.json             - конфиг пакетного менеджера npm
 ├─gulpfile.js              - конфиг Gulp
 ├─stylus.template.mustache - маска для чтения спрайтов
 ├─TODO                     - todo лист
 └─.gitignore               - конфиг для Git

 Команды для командной строки
 Все команды гальпа для командной строки состоят из двух частей это непосредственно сама команда gulp и через пробел имя таска. Вот список команд применимых для нашего конфига:

 gulp - основная команда, запускает таск default
 gulp build - билдим всё
 gulp watch - запуск watch
 gulp clean - очистка каталога build
 gulp connect - запуск сервер
 gulp html:build - билд HTML
 gulp jshint:build - проверяем JS на ошибки
 gulp js:build - билд JS
 gulp sprites:build - билд спрайта
 gulp image:build - билд статичных изображений
 gulp imagecontent:build - билд динамичных изображений
 gulp cssOwn:build - билд пользовательского CSS
 gulp cssVendor:build - билд внешних CSS
 gulp css:build - общий билд CSS
 gulp fonts:build - билд шрифтов
 gulp htaccess:build - билд .htaccess
