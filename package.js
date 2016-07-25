Package.describe({
  name:     'ksrv:messages',
  version:  '0.0.1',
  summary:  'Create client messages interface',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.5.1');
  api.use('ecmascript');
  api.use('mongo@1.1.9', 'client');
  api.use('aldeed:simple-schema@1.5.3', 'client');
 
  api.export('Messages');
  api.export('SysMessages', 'client');
  api.export('Message',     'client');

  api.mainModule('messages.js');
});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('practicalmeteor:mocha');
//   api.use('ksrv:messages');
//   api.mainModule('messages-tests.js');
// });
