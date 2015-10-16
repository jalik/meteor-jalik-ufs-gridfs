Package.describe({
    name: 'jalik:ufs-gridfs',
    version: '0.1.1',
    author: 'rodrigoknascimento@gmail.com',
    summary: 'GridFS store for UploadFS',
    homepage: 'https://github.com/jalik/jalik-ufs-gridfs',
    git: 'https://github.com/jalik/jalik-ufs-gridfs.git',
    documentation: 'README.md',
    license: 'MIT'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use('check');
    api.use('underscore');
    api.use('mongo');
    api.use('jalik:ufs@0.2.4');
    api.addFiles('ufs-gridfs.js');
});

Npm.depends({
    'gridfs-stream': '0.5.3'
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('jalik:ufs-gridfs');
    api.addFiles('ufs-gridfs-tests.js');
});