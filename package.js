Package.describe({
  name:     'ksrv:system-messages',
  version:  '0.0.1',
  summary:  'Simple solution for meteor system messages',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.5.1');
  api.use('modules');
  api.use('ecmascript');
  api.use('mongo@1.1.9', 'client');
  api.use('aldeed:simple-schema@1.5.3', 'client');
 
  api.mainModule('system-messages.js', ['client', 'server']);

  api.export('SMTemplates', ['client', 'server']);
  api.export('SysMessages', 'client');
  api.export('SysMessage', 'client');
});
