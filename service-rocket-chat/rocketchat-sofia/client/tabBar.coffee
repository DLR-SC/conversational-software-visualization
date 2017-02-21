Meteor.startup ->
	Tracker.autorun ->
		if RocketChat.settings.get('Sofia_Enabled')
			console.log 'Adding sofia tabs to tabbar'
			RocketChat.TabBar.addButton
				groups: ['channel', 'group', 'direct']
				id: 'sofia-button2'
				i18nTitle: 'rocketchat-chatops:Chatops_Title'
				icon: 'icon-hubot'
				template: 'sofia_bundles'
				order: 4

			RocketChat.TabBar.addButton
				groups: ['channel', 'group', 'direct']
				id: 'sofia-button3'
				i18nTitle: 'rocketchat-chatops:Chatops_Title'
				icon: 'icon-inbox'
				template: 'sofia_bundles'
				width: 675
				order: 5
		else
			RocketChat.TabBar.removeButton 'sofia-button2'
			RocketChat.TabBar.removeButton 'sofia-button3'
