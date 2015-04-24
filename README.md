# box-manage
This is a work in progress. Currently it is my sandbox for:

* Creating a box API for node utilizing their Provisioning feature. This allows an app to upload and access content on behalf of a Box user.
* Experiment with "best practices" for Angular found on various sites.  
* Deploy to Heroku with grunt without adding the dist/ directory to git.
* Create boilerplate with Yoeman
* Integrate SB Admin Angular dashboard.

Live - http://manage-box.herokuapp.com/

## Best Practices?

I found many things labled "best practices" online, some of it conflicting. I want try out the practices that made the most sense to me and see how they work in a "real" project.

* Organize directory by function
* 'namespace' - name controllers, services, directives by directory.  This will make them easy to find when referenced, and will avoid conflict with any other libraries.
* No $http in controllers - use services.
* Use closures everywhere.
* Don't use anonymous functions.
* Global http error handler. This can be bypassed by setting config.bypassErrorInterceptor = true in the request config.

## Heroku

Most of what I read online said to do a grunt build, and add the 'dist' folder to git.  This just seems wrong to me.  I finally found out how to do the build on heroku, so dist is never in git.

## Grunt

Tweak the Grunt file to support the new directory structure.

## Yeoman

## Box

Allow users to upload/download files on behalf of a box user.  See Provisioning https://developers.box.com/provision/  The Box feature that allows this is only available for paid accounts.

When an initial request is rejected with a 401, automatically refresh the access token and try again.
