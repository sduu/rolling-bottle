import gulp from 'gulp';
import babel from 'gulp-babel';
import GulpUglify from 'gulp-uglify';
import gulpStripDebug from 'gulp-strip-debug';
import GulpCleanCss from 'gulp-clean-css';
import minifyHtml from 'gulp-minify-html';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import { deleteAsync } from 'del';

const { task, watch, src, dest, series } = gulp;
const sass = gulpSass(dartSass);

sass.compiler = dartSass;

task('start', async () => {
  console.log('Gulp 시작');
});

task('clean', async () => {
  console.log('dist 하위 파일을 삭제');
  await deleteAsync(['dist/**/*'], { force: true });
});

task('create-scss', async () => {
  console.log('src 경로 scss 파일을 컴파일하고 압축하여 dist 경로에 저장');
  await src(['src/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(GulpCleanCss({ compatibility: 'ie8' }))
    .pipe(dest('dist'));
});

task('create-css', async () => {
  console.log('src 경로 css 파일을 압축하여 dist 경로에 저장');
  await src(['src/**/*.css'])
    .pipe(concat('style.css'))
    .pipe(GulpCleanCss({ compatibility: 'ie8' }))
    .pipe(dest('dist'));
});

task('create-js', async () => {
  console.log('src 경로 js 파일을 압축하여 dist 경로에 저장');
  const dirScript = 'dist/script';

  await src(['src/script/*.js', 'src/script/**/*.jsx', '!src/script/libs/*.js'], { sourcemaps: true })
    .pipe(gulpStripDebug())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(GulpUglify())
    .pipe(dest(dirScript));

  await src(['src/script/libs/*.js']).pipe(dest(dirScript + '/libs'));
});

task('create-html', async () => {
  console.log('src 경로 html 파일을 압축하여 dist 경로에 저장');
  await src(['src/*.html']).pipe(minifyHtml()).pipe(dest('dist'));
});

task('create-img', async () => {
  console.log('src 경로 이미지 파일을 압축하여 dist 경로에 저장');
  await src(
    [
      'src/assets/**/*.jpg',
      'src/assets/**/*.png',
      'src/assets/**/*.gif',
      'src/assets/**/*.svg',
      'src/assets/**/*.webp',
    ],
    { encoding: false }
  )
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(dest('dist/assets'));
});

task('watch', async () => {
  console.log('src 경로의 파일을 감지하여 변경 시 자동으로 빌드');
  watch('src/**/*.scss', series(['create-scss']));
  watch('src/**/*.js', series(['create-js']));
  watch('src/**/*.html', series(['create-html']));
});

task('end', async () => {
  console.log('Gulp 종료');
});

task(
  'default',
  series(['start', 'clean', 'create-scss', 'create-css', 'create-js', 'create-html', 'create-img', 'watch', 'end'])
);
