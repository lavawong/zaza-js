// JS打包文件
var path = require('path');
var dir = __dirname;
var js_path = path.resolve(dir, './js/src');


var banner = '/* <%=pkg.name%> | <%=pkg.description%> | vserion <%=pkg.version%>*/\r\n';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// includes: {
		// 	options: {
		// 		includeRegexp: /^[ ]*include[ ]*\([ ]*['"]?([^'"]+)['"]?[ ]*\)[ ]*;[ ]*/,
		// 		banner : banner,
		// 		debug: true
		// 	},
		// 	files: {
		// 		src : './js/src/include.js',
		// 		dest : './js/assets/mask.js'
		// 	}
		// }
		uglify: {
			options: {
                mangle: {
					except: ['jQuery', 'angular']
                },
                banner: banner,
                warnings: true,
                //美化代码
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            mask: {
                files: {
					'js/assets/mask.min.js' : ['js/assets/mask.js']
				},
                expand: true,
                flatten: true,
                ext: '.js'
            }
		},
		concat: {
			options: {
				separator: ';\r\n',
			},
			mask: {
				src: [js_path+'/conf/mask.js', js_path+'/factory/*.js'
					, js_path+'/filter/*.js', js_path+'/service/*.js'
					, js_path+'/directive/*.js', js_path+'/ctrl/*.js'],
				dest: './js/assets/mask.js'
			}
		},
		copy: {
            lib: {
                files: [{
                    expand: true, 
                    src: ['*.min.js'], 
                    cwd: './js/src/lib/',
                    dest: './js/assets/lib/', 
                    filter: 'isFile'
                }]
            },
			zip: {
				files: [{
					expand: true, 
					src: ['./js/assets/**/*.min.js'], 
					dest: './zip/', 
					filter: 'isFile'
				}, {
					expand: true, 
					src: ['./html/*.html'], 
					dest: './zip/', 
					filter: 'isFile'
				}, {
					expand: true, 
					src: ['./style/**/*.css', './style/**/*.png', './style/**/*.jpg'], 
					dest: './zip/', 
					filter: 'isFile'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-css-combo');
	grunt.loadNpmTasks('grunt-contrib-copy');

/*
    grunt.registerTask('css',['css_combo:css','copy:images']);
    grunt.registerTask('app',['uglify:apps']);
*/
    grunt.registerTask('maskconcat',['concat:mask']);
    grunt.registerTask('zipcopy',['copy:lib', 'copy:zip']);
    grunt.registerTask('maskuglify',['uglify:mask']);

    grunt.registerTask('replaceurl', 'replace load.node', function(){
    	console.log(__dirname);
    	var filepath = __dirname+'/zip/html/home.html';
    	var html = grunt.file.read(filepath, {encoding:'utf-8'});
    	html = html.replace('../tools/load.node?pageid=mask', '../js/assets/mask.min.js');
    	html = html.replace('<!--cordova-->', '<script src="../cordova.js"></script>');
    	grunt.file.write(filepath, html, {encoding:'utf-8'});
    	
    });
	

	grunt.registerTask('default', ['maskconcat', 'maskuglify', 'zipcopy', 'replaceurl']);
};

