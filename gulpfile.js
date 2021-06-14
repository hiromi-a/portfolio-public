const gulp = require('gulp');
const sass = require('gulp-sass'); //Sassコンパイル
const plumber = require('gulp-plumber'); //エラー時の強制終了を防止
const notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
const sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
const browserSync = require( 'browser-sync' ); //ブラウザ反映
const postcss = require('gulp-postcss'); //autoprefixerとセット
const autoprefixer = require('autoprefixer'); //ベンダープレフィックス付与
const cssdeclsort = require('css-declaration-sorter'); //css並べ替え
const imagemin = require('gulp-imagemin');
const optipng = require('imagemin-optipng');
const mozjpeg = require('imagemin-mozjpeg');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename'); //.ejsの拡張子を変更
const uglify = require('gulp-uglify');
const fs = require('fs');


// scssのコンパイル
gulp.task('sass', function() {
  return gulp
  .src( 'src/scss/*.scss' )
  .pipe( plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }) )//エラーチェック
  .pipe( sassGlob() )//importの読み込みを簡潔にする
  .pipe( sass({
    outputStyle: 'expanded' //expanded, nested, campact, compressedから選択
  }) )
  .pipe( postcss([ autoprefixer(
    {
      // ☆IEは11以上、Androidは5以上
      // その他は最新2バージョンで必要なベンダープレフィックスを付与する
      'overrideBrowserslist': ['last 2 versions', 'ie >= 11', 'Android >= 5'],
      cascade: false}
    ) ]) )
    .pipe(gulp.dest('dist/css'));//コンパイル後の出力先
  });

  // 保存時のリロード
  gulp.task( 'browser-sync', function(done) {
    browserSync.init({

      //ローカル開発
      server: {
        baseDir: 'dist',
        index: 'index.html'
      }
    });
    done();
  });

  gulp.task( 'bs-reload', function(done) {
    browserSync.reload();
    done();
  });

  gulp.task('ejs', (done) => {
    gulp
    .src(['src/ejs/**/*.ejs', '!' + 'src/ejs/**/_*.ejs'])
    .pipe( plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }) )//エラーチェック
    .pipe(ejs())
    .pipe(rename({extname: '.html'})) //拡張子をhtmlに
    .pipe(gulp.dest('dist')); //出力先
    done();
  });

  gulp.task('itemadd', () => {
  const templateFile = 'src/ejs/_components/_template.ejs';
  const dataJson = JSON.parse(fs.readFileSync('src/json/data.json', 'utf-8'));
  const page = Object.keys(dataJson);
  const onError = (err) => {
    console.log(err.message);
    this.emit('end');
  };
  // ページの数だけループ
  page.forEach((page, i) => {
    const id = ++i;
    const adjustID = String(id).padStart(4,0);

    gulp.src(templateFile)
      .pipe(ejs({
        data: dataJson[page]
      }).on('error', onError))
      .pipe(rename(`_item${adjustID}.ejs`))
      .pipe(gulp.dest('src/ejs/_items'));
  })
})

  // 監視
  gulp.task( 'watch', function(done) {
    gulp.watch( 'src/scss/*.scss', gulp.task('sass') ); //sassが更新されたらgulp sassを実行
    gulp.watch('src/scss/*.scss', gulp.task('default')); //sassが更新されたらbs-reloadを実行
    gulp.watch( 'src/js/*.js', gulp.task('default') ); //jsが更新されたらbs-relaodを実行
    gulp.watch( 'src/js/*.js', gulp.task('bs-reload') ); //jsが更新されたらbs-relaodを実行
    gulp.watch('src/ejs/**/*.ejs',gulp.task('ejs') ) ; //ejsが更新されたらgulp-ejsを実行
    gulp.watch('src/ejs/**/*.ejs',gulp.task('bs-reload') ) ; //ejsが更新されたらbs-reloadを実行
  });

  // default
  gulp.task('watch', gulp.series(gulp.parallel('browser-sync', 'watch')));

  //圧縮率の定義
  const imageminOption = [
    optipng({ optimizationLevel: 5 }),
    mozjpeg({ quality: 80 }),
    imagemin.gifsicle({
      interlaced: false,
      optimizationLevel: 1,
      colors: 256
    }),
    imagemin.mozjpeg(),
    imagemin.optipng(),
    imagemin.svgo()
  ];
  // 画像の圧縮
  // $ gulp imageminで./src/img/フォルダ内の画像を圧縮し./img/フォルダへ
  // .gifが入っているとエラーが出る
  gulp.task('imagemin', function () {
    return gulp
    .src(['src/img/*.{png,jpg,gif,svg}', 'src/img/**/*.{png,jpg,gif,svg}'])
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('dist/img'));
  });

  // JS圧縮
  gulp.task('default', function () {
    return gulp
    .src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist/js'));
  });
