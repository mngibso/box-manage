# box-manage
Used angular-fullstack.  Sandbox for:

* Experiment with "best practices" for Angular found in various videos.  
* Figure out how to deploy to Heroku with grunt.
* Play with Yeoman.
* Play with box api.

## Best Practices?

I found many things labled "best practices" online, some of it conflicting. I want try out the practices that made the most sense to me and see how they work in a "real" project.

* Organize directory by function
* 'namespace' - name controllers, services, directives by directory.  This will make them easy to find when referenced, and will avoid conflict with any other libraries.
* No $http in controllers - use services.
* Use closures everywhere.
* Don't use anonymous functions.

## Heroku

Most of what I read online said to do a grunt build, and add the 'dist' folder to git.  This just seems wrong to me.  I finally found out how to do the build on heroku, so dist is never in git.

## Grunt

Tweak the Grunt file to support the new directory structure.

## Yeoman

# Box

Allow users to upload/download files on behalf of a box user.  see Provisioning https://developers.box.com/provision/
