---
layout: post
title: Grunt.js 在前端项目中的实战
description: 在前端发展越来越需要工具的今天，Grunt.js这样的任务管理工具必不可少，一些流行的前端项目，也早已经用上了这个强大的工具，为项目的发布提供了不少方便，感谢这些牛人们做出的伟大贡献，如何在自己的项目中使用，就是这篇blog要研究的问题。
category: blog
---

##Grunt是什么？

[Grunt][Grunt]是一个基于JavaScript的任务运行工具。

为什么要使用Grunt，简而言之是为了“自动”，用工具自动完成压缩、编译、单元测试、拼写检查等重复性工作。

Grunt的社区壮大非常快，现在支持的模块有：[CoffeeScript][1]、 [handlerbars][2]、 [jade][3]、 [JSHint][4]、 [Less][5]、 [RequireJS][6]、 [Sass][7]、 [stylus][8]等。

##Grunt基本配置

Grunt及其插件都是用[npm][npm]管理的，npm是[Node.js][node]的包管理程序，所以在使用Grunt之前，你需要先安装NodeJS。

###安装CLI

首先需要在全局环境中安装Grunt command line interface (CLI)，在Mac等系统中需要sudo来执行下面的命令：

    npm install -g grunt-cli

这会将`grunt`命令安装在系统path中，这样就可以从任何目录执行了。需要注意的是，安装了`grunt-cli`并没有安装任务管理工具。`CLI`的职责很简单，就是运行`Gruntfile`中定义的`Grunt`版本，这样你就可以在一台机器运行多个版本的Grunt。

如果从0.3版本升级，需要先卸载旧版：

    npm uninstall -g grunt

##已存在Grunt的项目

对于已经使用了Grunt的项目，搭建本地环境是非常方便的，只需要切换到该项目目录，然后执行：

    npm install

再使用`grunt`命令运行Grunt即可。

##新建Grunt项目

最基本的步骤就是给项目添加两个文件`package.json`和`Gruntfile`。

- `package.json`：在这个文件里你可以列出项目所需的Grunt插件，npm会自动下载。
- `Grunfile`：这个文件命名为`Gruntfile.js`或者`Gruntfile.coffee`，用来描述你所需要的grunt任务。

###package.json

`package.json`文件需要放置在项目的根目录，和代码一起提交。运行`npm install`命令，会安装`package.json`中列出的依赖插件的正确版本。

创建`package.json`有以下几种办法：

<ul>
    <li>大部分<code>grunt-init</code>模板，会创建项目相关的<code>package.json</code>文件</li>
    <li><code>npm init</code>命令会创建基本的<code>package.json</code>文件</li>
    <li>也可以下面这个范本创建，更多用法可以看<a href="https://npmjs.org/doc/json.html" target="_blank" class="external">specification</a></li>
</ul>

    {
        "name": "my-project-name",
        "version": "0.1.0",
        "devDependencies": {
            "grunt": "~0.4.1",
            "grunt-contrib-jshint": "~0.6.0",
            "grunt-contrib-nodeunit": "~0.2.0",
            "grunt-contrib-uglify": "~0.2.2"
        }
    }

###安装Grunt和插件
对于已存在`package.json`文件的项目，最简单的安装方法就是`npm install <module> --save-dev`，例如：

    npm install grunt --save-dev

这个命令会安装最新版的`grunt`，并且把对这个插件的依赖写入`package.json`。很方便。


##Gruntfile

和`package.json`文件一样，`Gruntfile.js`或者`Gruntfile.coffee`需要放在根目录下和源码一起提交。

`Gruntfile`由以下几个部分组成：

<ul>
    <li><code>wrapper</code>函数</li>
    <li>项目和任务配置</li>
    <li>加载Grunt插件和任务</li>
    <li>自定义任务</li>
</ul>

###示例Gruntfile

在下面这个例子中，项目信息引自`package.json`，grunt-contrib-uglify插件的`uglify`任务用来压缩js文件，并且根据项目的metadata生成一条注释。当grunt运行时，uglify任务会默认执行。

    module.exports = function(grunt) {

      // Project configuration.
      grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
          options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'build/<%= pkg.name %>.min.js'
          }
        }
      });

      // Load the plugin that provides the "uglify" task.
      grunt.loadNpmTasks('grunt-contrib-uglify');

      // Default task(s).
      grunt.registerTask('default', ['uglify']);

    };

这就是一个完整的`Gruntfile`，我们仔细研究下。

###wrapper函数

每个`Gruntfile`（包括插件）使用这个默认的格式，你的所有的Grunt代码也必须写在这个函数中：

    module.export = function(grunt){
        //Do grunt-related things in here
    };

###项目和任务配置

大多Grunt的任务依赖于[grunt.initConfig][10]方法中定义的配置。

在这个例子中，Grunt通过`grunt.file.readJSON('package.json')`引入了`package.json`中定义的Grunt配置。因为`<% %>`模板变量可以引用任何配置，所以像文件路径、文件列表这些内容应该存储在变量中，以减少重复。

和其他任务一样，任务的配置需要和任务名字一样的变量，具体的参数可以查询各任务的文档。

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      uglify: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        build: {
          src: 'src/<%= pkg.name %>.js',
          dest: 'build/<%= pkg.name %>.min.js'
        }
      }
    });

###加载Grunt的插件和任务

很多常用的任务比如[concatenation][11]、 [minification][12]、 [linting][13]都有[Grung插件][14]。只要在`package.json`中声明，然后通过`npm install`安装，就可以在`Gruntfile`中配置使用了。

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

`grunt --help`可以查看所有可用的任务。

###自定义任务

你可以配置让Grunt运行一个或多个默认任务。在例子中，运行`grunt`不带任何参数就会执行`uglify`任务。这和`grunt uglify`或者`grunt default`是一样的效果。数组的长度任意。

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

如果你需要的任务并没有插件提供，那么也可以自定义，自定义的任务可以不写任务配置

    module.exports = function(grunt) {

      // A very basic default task.
      grunt.registerTask('default', 'Log some stuff.', function() {
        grunt.log.write('Logging some stuff...').ok();
      });

    };

自定义的任务也不必一定写在`Gruntfile`中，也可以定义在外部的`.js`文件中，然后通过[grunt.loadTasks][15]来加载。

##实战

grunt插件中有contrib前缀的是Grunt团队自行开发的插件，也是推荐使用的，下面挑选几个在前端项目中必用的插件，在实际例子中介绍一下使用方法。

###grunt-contrib-compass

[Compass][17]是[SASS][18]的一个框架，就像jQuery之于Javascript、Rails之于Ruby。具体的用法可以参考阮一峰的这两篇Blog:

<ul>
    <li><a href="http://www.ruanyifeng.com/blog/2012/06/sass.html">SASS用法指南</a></li>
    <li><a href="http://www.ruanyifeng.com/blog/2012/11/compass.html">Compass用法指南</a></li>
</ul>

首先，安装[grunt-contrib-compass][19]

    npm install grunt-contrib-compass --save-dev

如前所述，`--save-dev`可以在安装插件的过程中，将对这个插件的依赖自动写入`package.json`文件中，方便。

Compass并没有暴露所有的设置给Grunt，如果有别的需要，可以在config里面指定`config.rb`给Compass编译使用。看一个配置的例子：

    module.exports = function(grunt){
        grunt.initConfig({
          compass: {                  // compass任务
            dist: {                   // 一个子任务
              options: {              // 任务的设置
                sassDir: 'sass',
                cssDir: 'css',
                environment: 'production'
              }
            },
            dev: {                    // 另一个子任务
              options: {
                sassDir: 'sass',
                cssDir: 'style'
              }
            }
          }
        });

        grunt.loadNpmTasks('grunt-contrib-compass');

        grunt.registerTask('default', ['compass']);
    }

如果要使用外部文件的配置：

    grunt.initConfig({
      compass: {
        dist: {
          options: {
            config: 'config/config.rb'
          }
        }
      }
    });


###grunt-contrib-concat

[grunt-contrib-concat][20]是一个合并文件的插件，可以将多个css或js文件合并为一个，以节省链接数。同样的，安装：

    npm install grunt-contrib-concat --save-dev

这个插件有一下几个常用配置：

<ul>
    <li><code>seperator</code>：被合并的文件会用这个参数来join，例如你在合并压缩后的js文件时，可以加个<code>;</code>防止出错</li>
    <li><code>banner</code>：在合并后的文件头部加一些额外信息</li>
    <li><code>footer</code>：在合并后的文件尾部加一些额外信息</li>
</ul>

再看一下用法：

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
        options: {                                                      //配置
          stripBanners: true,
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +      //添加自定义的banner
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        dist: {                                                         //任务
            src: ['src/intro.js', 'src/project.js', 'src/outro.js'],    //源目录文件
            dest: 'dist/built.js'                                       //合并后的文件
        },
        basic_and_extras: {                                             //另一个任务
            files: {                                                    //另一种更简便的写法
                'dist/basic.js': ['src/main.js'],
                'dist/with_extras.js': ['src/main.js', 'src/extras.js']
            }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

最后在`default`事件中添加`concat`就会默认执行了。

###grunt-contrib-uglify

[grunt-contrib-uglify][21]用来压缩js文件，用法与`concat`类似，先安装：

    npm install grunt-contrib-uglify --save-dev

然后写入相应的配置：

    grunt.initConfig({
      uglify: {
        options: {
          banner: '/*! This is uglify test - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        app_task: {
          files: {
            'dist/app.min.js': ['js/app.js', 'js/render.js']
          }
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

恩，经过如此处理，你的js代码已经丑陋到无法直视了。

###grunt-contrib-watch

[grunt-contrib-watch][16]是开发必备插件，用来监控文件的修改，然后自动运行grunt任务，省去一遍遍手动执行Grunt命令，安装照旧：

    npm install grunt-contrib-watch --save-dev

使用watch插件时，需要注意一点，被watch的文件，可以分开写，这样可以提高watch的性能，不用每次把没修改的文件也执行一遍任务，看看例子：

    grunt.initConfig({
      watch: {
        css: {
          files: ['public/scss/*.scss'],
          tasks: ['compass'],
          options: {
            // Start a live reload server on the default port 35729
            livereload: true,
          },
        },
        another: {
          files: ['lib/*.js'],
          tasks: ['anothertask'],
          options: {
            // Start another live reload server on port 1337
            livereload: 1337,
          },
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

然后运行`grunt watch`命令，修改文件，就会看到设定的任务执行了。

##源码

Grunt的基本使用就是这些了，当然还有一些[搭建脚手架][23]等等的功能，等待你自己去学习使用吧，更多的[Grunt 插件][22]也等待你去发现。

贴出来源码，整体看一下：

###package.json

    {
      "name": "Grunt-in-action",
      "devDependencies": {
        "grunt": "~0.4.1",
        "grunt-contrib-compass": "~0.3.0",
        "grunt-contrib-watch": "~0.4.4",
        "grunt-contrib-concat": "~0.3.0",
        "grunt-contrib-uglify": "~0.2.2"
      }
    }

###Gruntfile.js

    module.exports = function(grunt){
        grunt.initConfig({
            compass: {                  // Task
                dist: {                   // Target
                    options: {              // Target options
                        sassDir: 'sass',
                        cssDir: 'css',
                        environment: 'production'
                    }
                },
                dev: {                    // Another target
                    options: {
                        sassDir: 'sass',
                        cssDir: 'style'
                    }
                }
            },

            concat: {
                options: {                                       //配置
                    stripBanners:true,
                    banner: '/*! This is the grunt test ' +      //添加自定义的banner
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                basic: {                                         //另一个任务
                    files: {                                     //另一种更简便的写法
                        'dist/style.css': ['style/screen.css','style/ie.css','style/print.css']
                    }
                }
            },

            uglify: {
                options: {
                    banner: '/*! This is uglify test - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                app_task: {
                    files: {
                        'dist/app.min.js': ['js/app.js', 'js/render.js']
                    }
                }
            },

            watch: {
                css: {
                    files: ['sass/*.scss'],
                    tasks: ['compass', 'concat']
                },
                another: {
                    files: ['js/*.js'],
                    tasks: ['uglify']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-compass');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.registerTask('default', ['compass','concat', 'uglify']);
    }


[BeiYuu]:    http://beiyuu.com  "BeiYuu"
[Grunt]: http://gruntjs.com/
[npm]: https://npmjs.org/
[node]: http://nodejs.org/
[1]: http://coffeescript.org/
[2]: http://handlebarsjs.com/
[3]: http://jade-lang.com/
[4]: http://www.jshint.com/
[5]: http://lesscss.org/
[6]: http://requirejs.org/
[7]: http://sass-lang.com/
[8]: http://learnboost.github.io/stylus/
[9]: https://npmjs.org/doc/json.html
[10]: http://gruntjs.com/grunt#grunt.initconfig
[11]: https://github.com/gruntjs/grunt-contrib-concat
[12]: http://github.com/gruntjs/grunt-contrib-uglify
[13]: https://github.com/gruntjs/grunt-contrib-jshint
[14]: https://github.com/gruntjs
[15]: http://gruntjs.com/grunt#grunt.loadtasks
[16]: https://npmjs.org/package/grunt-contrib-watch
[17]: http://compass-style.org/
[18]: http://sass-lang.com/
[19]: https://npmjs.org/package/grunt-contrib-compass
[20]: https://npmjs.org/package/grunt-contrib-concat
[21]: https://npmjs.org/package/grunt-contrib-uglify
[22]: http://gruntjs.com/plugins/
[23]: http://gruntjs.com/project-scaffolding
