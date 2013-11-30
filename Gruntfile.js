'use strict';

/*jshint node:true */
module.exports = function(grunt) {


  // Shared configuration
  var localPort = 8239;  // "BREQ"

  // Project configuration.
  grunt.initConfig({
  
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> (<%= pkg.title %>) - v<%= pkg.version %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
      
    // Task configuration.
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: ['Gruntfile.js'],
      src: ['src/**/*.js'],
      test: ['test/**/*.js']
    },
    connect: {
      server: {
        options: {
          port: localPort
        }
      }
    },
    qunit: {
      http: {
        options: {
          urls: grunt.file.expand(['test/**/*.html']).map(function(testPage) {
            return 'http://localhost:' + localPort + '/' + testPage + '?noglobals=true';
          })
        }
      }
    },
    clean: {
      dist: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/browser-require.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        preserveComments: 'some',
        report: 'min'
      },
      dist: {
        src: ['src/browser-require.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test %>',
        tasks: ['jshint:test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'connect', 'qunit', 'clean', 'concat', 'uglify']);
  // Travis CI task.
  grunt.registerTask('travis', ['jshint', 'connect', 'qunit']);

};
