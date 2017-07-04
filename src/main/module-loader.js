/**
 * Utility methods used for handling loading of modules (attached to $.formUtils)
 */
(function($) {

  'use strict';

  $.formUtils = $.extend($.formUtils || {}, {

    /**
     * @var {Boolean}
     */
    isLoadingModules: false,

    /**
     * @var {Object}
     */
    loadedModules: {},

    /**
     * @param {String} name
     */
    registerLoadedModule: function (name) {
      this.loadedModules[$.trim(name).toLowerCase()] = true;
    },

    /**
     * @param {String} name
     * @return {Boolean}
     */
    hasLoadedModule: function (name) {
      return $.trim(name).toLowerCase() in this.loadedModules;
    },

    /**
     * @example
     *  $.formUtils.loadModules('date, security.dev');
     *
     * Will load the scripts date.js and security.dev.js from the
     * directory where this script resides. If you want to load
     * the modules from another directory you can use the
     * path argument.
     *
     * The script will be cached by the browser unless the module
     * name ends with .dev
     *
     * @param {String} modules - Comma separated string with module file names (no directory nor file extension)
     * @param {String} [path] - Path where the module files are located if their not in the same directory as the core modules
     * @param {function} [callback] - Callback invoked when all modules are loaded
     */
    loadModules: function (modules, path, callback) {

      if ($.formUtils.isLoadingModules) {
        setTimeout(function () {
          $.formUtils.loadModules(modules, path, callback);
        }, 100);
        return;
      }

      var loadModuleScripts = function (modules, path) {

          var moduleList = $.split(modules),
            numModules = moduleList.length,
            moduleLoadedCallback = function () {
              numModules--;
              if (numModules === 0) {
                $.formUtils.isLoadingModules = false;
                if (typeof callback === 'function') {
                    callback();
                }
              }
            };

          if (numModules > 0) {
            $.formUtils.isLoadingModules = true;
          }

          var cacheSuffix = '?_=' + ( new Date().getTime() ),
            appendToElement = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];

          $.each(moduleList, function (i, modName) {
            modName = $.trim(modName);
            if (modName.length === 0 || $.formUtils.hasLoadedModule(modName)) {
              moduleLoadedCallback();
            } else {
              var scriptUrl = path + modName + (modName.slice(-3) === '.js' ? '' : '.js'),
                script = document.createElement('SCRIPT');

              if (typeof define === 'function' && define.amd) {
                require([scriptUrl + ( scriptUrl.slice(-7) === '.dev.js' ? cacheSuffix : '' )], moduleLoadedCallback);
              } else {
                // Load the script
                script.type = 'text/javascript';
                script.onload = moduleLoadedCallback;
                script.src = scriptUrl + ( scriptUrl.slice(-7) === '.dev.js' ? cacheSuffix : '' );
                script.onerror = function() {
                  $.formUtils.warn('Unable to load form validation module '+scriptUrl, true);
                  moduleLoadedCallback();
                };
                script.onreadystatechange = function () {
                  // IE 7 fix
                  if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    moduleLoadedCallback();
                    // Handle memory leak in IE
                    this.onload = null;
                    this.onreadystatechange = null;
                  }
                };
                appendToElement.appendChild(script);
              }
            }
          });
        };

      if (path) {
        loadModuleScripts(modules, path);
      } else {
        var findScriptPathAndLoadModules = function () {
          var foundPath = false;
          $('script[src*="form-validator"]').each(function () {
            var isScriptFromPluginNodeModulesDirectory = this.src.split('form-validator')[1].split('node_modules').length > 1;
            if (!isScriptFromPluginNodeModulesDirectory) {
              foundPath = this.src.substr(0, this.src.lastIndexOf('/')) + '/';
              if (foundPath === '/') {
                foundPath = '';
              }
              return false;
            }
          });

          if (foundPath !== false) {
            loadModuleScripts(modules, foundPath);
            return true;
          }
          return false;
        };

        if (!findScriptPathAndLoadModules()) {
          $(function () {
            var hasLoadedModuleScripts = findScriptPathAndLoadModules();
            if (!hasLoadedModuleScripts) {
              // The modules may have been inserted via a minified script
              if (typeof callback === 'function') {
                callback();
              }
            }
          });
        }
      }
    }

  });

})(jQuery);
