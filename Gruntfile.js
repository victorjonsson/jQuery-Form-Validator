var fs = require('fs'),
    filesToBuild = {
      uglify : {},
      concat : {},
      devFiles : []
    },
    readFile = function(file) {
      return fs.readFileSync(file, 'utf-8');
    },
    replaceInFile = function(path, from, to) {
      fs.writeFileSync(path, readFile(path).replace(from, to));
    };

module.exports = function(grunt) {

  // Gather up all js files
  ['form-validator/', 'form-validator/lang/'].forEach(function(path) {
    fs.readdirSync(path).forEach(function(fileName) {
      if(fileName.substr(-7) == '.dev.js') {
        var name = fileName.substr(0, fileName.length - 7);
        filesToBuild.uglify[path + name + '.js'] = [path + name + '.js'];
        filesToBuild.concat['file'+name] = {
          src : [path + fileName],
          dest: path + name + '.js'
        }
        filesToBuild.devFiles.push( path + fileName );
      }
    });
  });

  // Add options for concat ang ugligy
  filesToBuild.concat.options = {
      banner: "<%= meta.banner %>"
    };
  filesToBuild.uglify.options = {
      banner: "<%= meta.banner %>"
    };

  // Add main script to concat/uglify
  filesToBuild.uglify['form-validator/jquery.form-validator.min.js'] = 'form-validator/jquery.form-validator.min.js';
  filesToBuild.concat.main = {
    src : ['form-validator/jquery.form-validator.js'],
    dest : 'form-validator/jquery.form-validator.min.js'
  }

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/**\n" +
				" *  <%= (pkg.title || pkg.name).toUpperCase() %>\n" +
				" *\n" +
				" *  @website by <%= pkg.author.homepage %>\n" +
				" *  @license <%= pkg.license %>\n" +
        " *  @version <%= pkg.version %>\n" +
				" */\n"
		},

		// Concat definitions. The only purpose of this
    // is to create a distribution file out
    // of files name *.dev.js
		concat: filesToBuild.concat,

		// Lint definitions
		jshint: {
			files: ["form-validator/*.dev.js", "form-validator/jquery.form-validator.js"],
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
		    files: ['form-validator/*'],
		    tasks: ['default']
		},

    qunit: {
      all: ['test/qunit.html']
    }

	});


  /*
   * Change to new version or the next version number in all files
   * containing the version definition
   */
  grunt.registerTask('version', 'Bump up the version number, or change version name by adding --new-version=3.1.0', function() {
    var pkg = grunt.config.get('pkg'),
        currentVersion = pkg.version,
        newVersion = grunt.option('new-version');


    if( !newVersion ) {
        var versionParts = currentVersion.split('.'),
            newSubVersion = parseInt(versionParts.splice(versionParts.length-1, 1)[0]) + 1;
        newSubVersion = newSubVersion < 10 && newSubVersion > 0 ? '0'+newSubVersion : newSubVersion.toString();
        newVersion = versionParts.join('.') + '.' + newSubVersion;
    }

    grunt.log.writeln('* Moving from version '+currentVersion+' to '+newVersion);

    // replace version in config files and dev-files
    replaceInFile('form-validator/jquery.form-validator.min.js', '@version '+currentVersion, '@version '+newVersion);
    replaceInFile('form-validator/jquery.form-validator.js', '@version '+currentVersion, '@version '+newVersion);
    replaceInFile('package.json', '"version": "'+currentVersion+'"', '"version": "'+newVersion+'"');
    replaceInFile('formvalidator.jquery.json', '"version": "'+currentVersion+'"', '"version": "'+newVersion+'"');
    filesToBuild.devFiles.forEach(function(filePath) {
      replaceInFile(filePath, '@version '+currentVersion, '@version '+newVersion);
    });

    // Set new version globally (can later on be used by concat/uglify)
    pkg.version = newVersion;
    grunt.config.set('pkg', pkg);
  });


	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.registerTask("build", ["qunit", "version", "concat", "uglify"]);
	grunt.registerTask("default", ["jshint", "build"]);

};
