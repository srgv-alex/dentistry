const { task, src, dest, watch, parallel, series } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp').default || require('gulp-webp');
const ttf2woff = require('gulp-ttf2woff').default || require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgsprite = require('gulp-svg-sprite');
const fs = require('fs');

task('html', function () {
	return src('./src/*.html')
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: '@file',
			})
		)
		.pipe(dest('./build/'));
});

task('sass', function () {
	return src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(postcss([autoprefixer()]))
		.pipe(dest('./build/css/'));
});

task('js', function () {
	return src('./src/js/**/*').pipe(dest('./build/js/'));
});
task('images', function () {
	return (
		src('./src/img/**/*', { encoding: false })
			.pipe(webp())

			// .pipe(src('./src/img/**/*', { encoding: false }))
			// .pipe(imagemin({ verbose: true }))

			.pipe(dest('./build/img/'))
	);
});

task('sprite', function () {
	return src('./src/img/svgicons/**/*.svg')
		.pipe(
			svgsprite({
				mode: {
					symbol: {
						sprite: '../sprite.symbol.svg',
					},
				},
				shape: {
					transform: [
						{
							svgo: {
								js2svg: { indent: 4, pretty: true },
								plugins: [
									{
										name: 'removeAttrs',
										params: {
											attrs: '(fill|stroke)',
										},
									},
								],
							},
						},
					],
				},
			})
		)
		.pipe(dest('./build/img/svgsprite/'));
});

task('fonts', function () {
	src('./src/fonts/**/*.ttf', {
		encoding: false,
		removeBOM: false,
	})
		.pipe(ttf2woff())
		.pipe(dest('build/fonts'));

	src('./src/fonts/**/*.ttf')
		.pipe(ttf2woff2())

		.pipe(dest('build/fonts'));

	return src('./src/fonts/**/*.{woff,woff2}').pipe(dest('build/fonts'));
});

task('server', function () {
	return src('./build/').pipe(
		server({
			livereload: true,
			open: true,
		})
	);
});

task('clean', function (done) {
	if (fs.existsSync('./build/')) {
		return src('./build/').pipe(clean());
	}
	done();
});

task('watch', function () {
	watch('./src/**/*.html', parallel('html'));
	watch('./src/scss/**/*.scss', parallel('sass'));
	watch('./src/img/**/*.*', parallel('images'));
	watch('./src/js/**/*.js', parallel('js'));
	watch('./src/fonts/**/*.ttf', parallel('fonts'));
});

task(
	'default',
	series(
		'clean',
		parallel('html', 'sass', 'js', 'images', 'fonts', 'sprite'),
		parallel('server', 'watch')
	)
);
