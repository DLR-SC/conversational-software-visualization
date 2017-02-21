Meteor.startup ->
	RocketChat.settings.addGroup 'Sofia'
	RocketChat.settings.add 'Sofia_Enabled', false, { type: 'boolean', group: 'Sofia', public: true }
	RocketChat.settings.add 'Sofia_Username', false, { type: 'string', group: 'Sofia', public: true }
