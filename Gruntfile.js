module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['_dev/js/*.js']
    },
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: '_dev/js',
          src: ['*.js'],
          dest: 'js/',
          ext: '.min.js'
        }]
      }
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '_dev/js/libs/',
            src: ['**'],
            dest: 'js/libs/'
          },
          {
            expand: true,
            cwd: '_dev/js/polyfills/',
            src: ['**'],
            dest: 'js/polyfills/'
          },
          {
            expand: true,
            cwd: '_dev/inc/',
            src: ['**'],
            dest: 'inc/'
          },
          {
            expand: true,
            cwd: '_dev/inc/libs/',
            src: ['**/*'],
            dest: 'inc/libs/'
          },
          {
            expand: true,
            cwd: '_dev/templates/',
            src: ['**'],
            dest: 'templates/'
          },
          {
            expand: true,
            cwd: '_dev/',
            src: ['*.php'],
            dest: ''
          }
        ]
      }
    },
    watch: {
      scripts: {
        files: ['_dev/**/*'],
        tasks: ['jshint', 'uglify', 'copy'],
        options: {
          spawn: false
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'uglify', 'copy', 'watch']);
};
