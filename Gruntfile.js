
const SRC_DIR = './form-validator/src/';
const MODULE_DIR = './form-validator/';
const LANG_DIR = './form-validator/lang/';
const MAIN_PLUGIN_FILE = 'form-validator/jquery.form-validator.min.js';
const JS_EXTENSION = '.js';
const DEV_EXTENSION = '.dev.js';

var fs = require('fs'),
  filesToBuild = {
    uglify: {},
    concat: {
      main:{
        src:[SRC_DIR+'core-validators.js'],
        dest: MAIN_PLUGIN_FILE
      }
    },
    devFiles: []
  },
  isJavascriptFile = function(fileName) {
    return fileName.substr(-3) == JS_EXTENSION;
  },
  isDevFile = function(fileName) {
    return fileName.substr(-1 * DEV_EXTENSION.length) == DEV_EXTENSION;
  },
  readFile = function (file) {
    return fs.readFileSync(file, 'utf-8');
  },
  replaceInFile = function (path, from, to) {
    fs.writeFileSync(path, readFile(path).replace(from, to));
  };

module.exports = function (grunt) {

  // Gather up all module and language files
  [MODULE_DIR, LANG_DIR].forEach(function (path) {
    fs.readdirSync(path).forEach(function (fileName) {
      if (isDevFile(fileName)) {
        var name = fileName.substr(0, fileName.length - DEV_EXTENSION.length),
          fullPath = path + name + JS_EXTENSION;

        filesToBuild.uglify[fullPath] = [fullPath];
        filesToBuild.concat['file' + name] = {
          src: [path + fileName],
          dest: path + name + JS_EXTENSION
        };
        filesToBuild.devFiles.push(path + fileName);
      }
    });
  });
  // Gather up all source files that will added to minified core library
  fs.readdirSync(SRC_DIR).forEach(function (fileName) {
    var fullPath = SRC_DIR + fileName;
    if (isJavascriptFile(fileName) && filesToBuild.concat.main.src.indexOf(fullPath) == -1) {
      filesToBuild.concat.main.src.unshift(fullPath);
    }
  });

  // Add options for concat ang ugligy
  filesToBuild.concat.options = {
    banner: "<%= meta.banner %>"
  };
  filesToBuild.uglify.options = {
    banner: "<%= meta.banner %>"
  };

  // Add main script to uglify
  filesToBuild.uglify[MAIN_PLUGIN_FILE] = MAIN_PLUGIN_FILE;

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON("package.json"),

    // Banner definitions
    meta: {
      banner: "/**\n" +
      " *  <%= (pkg.title || pkg.name).toUpperCase() %>\n" +
      " *\n" +
      " *  @version <%= pkg.version %>\n" +
      " *  @website <%= pkg.homepage %>\n" +
      " *  @author <%= pkg.author.name %>, <%= pkg.author.url %>\n" +
      " *  @license <%= pkg.license %>\n" +
      " */\n"
    },

    // Concat definitions.
    concat: filesToBuild.concat,

    // Lint definitions
    jshint: {
      files: [MODULE_DIR+"*"+DEV_EXTENSION, SRC_DIR+"*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    // Minify definitions
    uglify: filesToBuild.uglify,

    // watch for changes to source
    // Better than calling grunt a million times
    // (call 'grunt watch')
    watch: {
      files: [SRC_DIR+'/*', LANG_DIR+'/*', MODULE_DIR+'/*'],
      tasks: ['build'],
      options : { nospawn : true }
    },

    // Unit tests
    qunit: {
      all: ['test/qunit.html']
    },

    // Standalone servers
    connect: {
      server: {
        options: {
          port: 8000,
          base: '.',
          keepalive: true
        }
      }
    }

  });

  /*
   * Change to new version or the next version number in all files
   * containing the version definition
   */
  grunt.registerTask('version', 'Bump up the version number, or change version name by adding --new-version=3.1.0', function () {
    var pkg = grunt.config.get('pkg'),
      currentVersion = pkg.version,
      newVersion = grunt.option('new-version');

    if (!newVersion) {
      var versionParts = currentVersion.split('.'),
        newSubVersion = parseInt(versionParts.splice(versionParts.length - 1, 1)[0]) + 1;
      newSubVersion = newSubVersion < 10 && newSubVersion > 0 ? '0' + newSubVersion : newSubVersion.toString();
      newVersion = versionParts.join('.') + '.' + newSubVersion;
    }

    grunt.log.writeln('* Moving from version ' + currentVersion + ' to ' + newVersion);
    var fromVersion = '@version ' + currentVersion,
      toVersion = '@version ' + newVersion;


    // replace version in config files and dev-files
    fs.readdirSync(SRC_DIR).forEach(function(file) {
      if (isJavascriptFile(file)) {
        replaceInFile(SRC_DIR+file, fromVersion, toVersion);
      }
    });
    filesToBuild.devFiles.forEach(function (filePath) {
      replaceInFile(filePath, fromVersion, toVersion);
    });

    replaceInFile('package.json', '"version": "' + currentVersion + '"', '"version": "' + newVersion + '"');
    replaceInFile('formvalidator.jquery.json', '"version": "' + currentVersion + '"', '"version": "' + newVersion + '"');

    // Set new version globally (can later on be used by concat/uglify)
    pkg.version = newVersion;
    grunt.config.set('pkg', pkg);
  });


  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask("build", ["version", "concat", "uglify"]);
  grunt.registerTask('test', ['concat', 'jshint', 'qunit']);
  grunt.registerTask("default", ["test", "build"]);

};
