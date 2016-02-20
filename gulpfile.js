
var gulp = require('gulp'), //основной плагин gulp
    sass  = require('gulp-sass'), //препроцессор stylus
    prefixer = require('gulp-autoprefixer'), //расставление автопрефиксов
    cssmin = require('gulp-minify-css'), //минификация css
    uglify = require('gulp-uglify'), //минификация js
    rigger = require('gulp-rigger'),// это просто киллер фича. Плагин позволяет импортировать один файл в другой простой конструкцией
//= footer.html ( //= template/footer.html ) и эта строка при компиляции будет заменена на содержимое файла footer.html
    imagemin = require('gulp-imagemin'), //минимизация изображений
    pngquant = require('imagemin-pngquant'),    // дополнения к предыдущему плагину, для работы с PNG
    rimraf = require('rimraf'), //очистка
    sourcemaps = require('gulp-sourcemaps'), //sourcemaps
    rename = require("gulp-rename"), //переименвоание файлов
    plumber = require("gulp-plumber"), //предохранитель для остановки гальпа
    watch = require('gulp-watch'), //расширение возможностей watch
    browserSync = require("browser-sync"),      // с помощью этого плагина мы можем легко развернуть локальный dev сервер с блэкджеком и livereload, а так же с его помощью мы сможем сделать тунель на наш localhost, что бы легко демонстрировать верстку заказчику
    useref = require('gulp-useref'),
    reload = browserSync.reload,
    sftp = require('gulp-sftp');

var path = { //Константы путей. Для удобства сразу определим все пути и маски:
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        php: 'build/',
        html: 'build/',
        js: 'build/js/',
        jsVendor: 'build/js/',
        css: 'build/css/',
        cssVendor: 'build/css/',
        img: 'build/img',
        contentImg: 'build/img',
        fonts: 'build/fonts/',
        htaccess: 'build/'
    },
    src: { //Пути откуда брать исходники
        php: 'src/**/*.php', //Синтаксис src/template/*.php говорит gulp что мы хотим взять все файлы с расширением .php
        html: 'src/**/*.html', //Синтаксис src/template/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/[^_]*.js',//В стилях и скриптах нам понадобятся только main файлы
        jsVendor: 'src/js/vendor/*.*', //Если мы хотим файлы библиотек отдельно хранить то раскоментить строчку
        css: 'src/scss/main.scss',
        cssVendor: 'src/scss/vendor/*.*', //Если мы хотим файлы библиотек отдельно хранить то раскоментить строчку
        img: 'src/css/images/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        contentImg: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        htaccess: 'src/.htaccess'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        php: 'src/**/*.php',
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/scss/**/*.*',
        img: 'src/css/images/**/*.*',
        contentImg: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        htaccess: 'src/.htaccess'
    },
    clean: './build', //директории которые могут очищаться
    outputDir: './build' //исходная корневая директория для запуска минисервера
};
/*
 *.js — все файлы с расширением js
 [^_]*.js — все файлы с расширением js, исключая те что начинаются с нижнего подчеркивания
 *.* — любые файлы с любым расширением в пределах текущей дитректории
 */

// Создадим переменную с настройками нашего dev сервера:
var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

// Веб сервер
// Что бы насладиться чудом livereload — нам необходимо создать себе локальный веб-сервер. Для этого напишем следующий простой таск:
gulp.task('webserver', function () {
    browserSync(config);
});

// таск для билдинга html
gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //выгрузим их в папку build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений
});

// Напишем таск для сборки php:
gulp.task('php:build', function () {
    gulp.src(path.src.php)                  //Выберем файлы по нужному пути
        .pipe(rigger())                     //Прогоним через rigger
        .pipe(gulp.dest(path.build.php))    //Выплюнем их в папку build
         .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений
});

// билдинг яваскрипта
gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к выходному файлу
        .pipe(gulp.dest(path.build.js)) //выгрузим готовый файл в build
         .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений
});

// билдинг яваскрипта
gulp.task('jsVendor:build', function () {
    gulp.src(path.src.jsVendor) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к выходному файлу
        .pipe(gulp.dest(path.build.js)) //выгрузим готовый файл в build
         .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений
});

// билдим js целиком
// Также добавим таск для билда общего js:
gulp.task('jsall:build', [
    'js:build',
    'jsVendor:build' // В случае если требуется обработать внешние стили отдельно от домашних и выгрузить их отдельными файлами нужно раскомментировать строчку 'jsVendor:build'
]);

// билдим статичные изображения
// Статичные изображения - это изображения используемые в шаблоне верстки.
gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true, //сжатие .jpg
            svgoPlugins: [{removeViewBox: false}], //сжатие .svg
            use: [pngquant()], //сжатие .png
            interlaced: true, //сжатие .gif
            optimizationLevel: 3 //степень сжатия от 0 до 7
        }))
        .pipe(gulp.dest(path.build.img)) //выгрузим в build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений //перезагрузим сервер
});

// билдим динамичные изображения
// Динамичные изображения — это контентные изображения, которые будут меняться на сайте и на уровне шаблона подключаются лишь для демонстрации. Например, это могут быть изображения для новостей и пр.
gulp.task('imagescontent:build', function() {
    gulp.src(path.src.contentImg)
        .pipe(imagemin({ //Сожмем их
            progressive: true, //сжатие .jpg
            svgoPlugins: [{removeViewBox: false}], //сжатие .svg
            interlaced: true, //сжатие .gif
            optimizationLevel: 3 //степень сжатия от 0 до 7
        }))
        .pipe(gulp.dest(path.build.contentImg)) //выгрузим в build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений //перезагрузим сервер
});

// билдинг пользовательского css
gulp.task('cssOwn:build', function () {
    gulp.src(path.src.css) //Выберем наш основной файл стилей
        .pipe(sourcemaps.init()) //инициализируем soucemap
        .pipe(sass({
            compress: true,
            'include css': true,
            includePaths: ['src/scss/'],
            outputStyle: 'compressed',
            sourceMap: true,
            errLogToConsole: true
        })) //Скомпилируем sass
        .pipe(prefixer({
            browser: ['last 3 version', "> 1%", "ie 8", "ie 7"]
        })) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write()) //пропишем sourcemap
        .pipe(rename({suffix: '.min'})) //добавим суффикс .min к имени выходного файла
        .pipe(gulp.dest(path.build.css)) //вызгрузим в build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений //перезагрузим сервер
});

// билдинг вендорного css
// Отдельный таск для внешних стилей:
gulp.task('cssVendor:build', function () {
    gulp.src(path.src.cssVendor) // Берем папку vendor
        .pipe(sourcemaps.init()) //инициализируем soucemap
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write()) //пропишем sourcemap
        .pipe(gulp.dest(path.build.css)) //выгрузим в build
        .pipe(reload({stream: true}));      //И перезагрузим наш сервер для обновлений //перезагрузим сервер
});

// билдим css целиком
// Также добавим таск для билда общего CSS:
gulp.task('css:build', [
    'cssOwn:build',
    'cssVendor:build' // В случае если требуется обработать внешние стили отдельно от домашних и выгрузить их отдельными файлами нужно раскомментировать строчку 'cssVendor:build'
]);


// билдим шрифты
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts)); //выгружаем в build
});

// билдим htaccess
gulp.task('htaccess:build', function() {
    gulp.src(path.src.htaccess)
        .pipe(gulp.dest(path.build.htaccess)); //выгружаем в build
});

// билдим SFTP
gulp.task('sftp:build', function () {
    return gulp.src('build/*')
        .pipe(sftp({
            host: 'website.com', // вводим адрес хоста
            user: 'johndoe', // имя юзера
            pass: '1234', // пароль
            remotePath: 'home/....' // вводим путь
        }));
});

// билдим все
// Для того чтобы нам не приходилось билдить каждую часть отдельно, пропишем таск для общего билда:
gulp.task('build', [
    'html:build',
    'php:build',
    'jsall:build',
    'css:build',
    'fonts:build',
    'htaccess:build',
    'image:build',
    'imagescontent:build'
]);

// чистим папку билда
// Иногда требуется полностью очистить каталог build. Здесь нам на помощь придет следующий таск:
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

// watch
gulp.task('watch', function(){
    //билдим html в случае изменения
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    //билдим php в случае изменения
    watch([path.watch.php], function(event, cb) {
        gulp.start('php:build');
    });
    //билдим контекстные изрображения в случае изменения
    watch([path.watch.contentImg], function(event, cb) {
        gulp.start('imagescontent:build');
    });
    //билдим css в случае изменения
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    //билдим js в случае изменения
    watch([path.watch.js], function(event, cb) {
        gulp.start('jsall:build');
    });
    //билдим статичные изображения в случае изменения
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    //билдим шрифты в случае изменения
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    //билдим htaccess в случае изменения
 //   watch([path.watch.htaccess], function(event, cb) {
 //       gulp.start('htaccess:build');
 //   });
});

// действия по умолчанию
// Действия по-умолчанию — это то какие задачи будет выполнять таск-менеджер при вводе команды gulp в консоль:
gulp.task('default', [/*'clean', */'build', 'watch', 'webserver'/*, 'sftp:build' */]);
