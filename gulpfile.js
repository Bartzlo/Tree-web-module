'use strict';

const
  gulp = require('gulp'),
  browserSync = require('browser-sync');

  gulp.task('serve', function() {
      browserSync.init({
          server: {baseDir: "src/"}
      });

      gulp.watch('src/**/*.*').on('change', browserSync.reload);
  });

gulp.task('default', ['serve']);
