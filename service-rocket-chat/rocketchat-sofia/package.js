Package.describe({
	name: 'sofia:osgi-view',
	version: '0.0.1',
	summary: 'Sofia OSGI Panel',
	git: ''
});

Package.onUse(function(api) {
	api.use([
		'coffeescript',
		'ecmascript',
		'rocketchat:lib'
	]);

	api.use('templating', 'client');

	api.addFiles([
		'client/startup.coffee',
		'client/tabBar.coffee',
		'client/views/sofia.html',
		'client/views/sofia.coffee',
		'client/views/bundles.html',
		'client/views/bundles.coffee',
		'client/views/stylesheets/chatops.css'
	], 'client');

	api.addFiles([
		'server/settings.coffee'
	], 'server');
});
