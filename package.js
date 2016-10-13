Package.describe({
    name: 'jalik:ufs-gridfs',
    version: '0.1.4',
    author: 'rodrigoknascimento@gmail.com',
    summary: 'GridFS store for UploadFS',
    homepage: 'https://github.com/jalik/jalik-ufs-gridfs',
    git: 'https://github.com/jalik/jalik-ufs-gridfs.git',
    documentation: 'README.md',
    license: 'MIT'
});

Package.onUse(function (api) {
    api.versionsFrom('1.4.1.1');
    api.use('check@1.2.1');
    api.use('ecmascript@0.4.3');
    api.use('underscore@1.0.8');
    api.use('mongo@1.1.7');
    api.use('jalik:ufs@0.7.1');
    api.addFiles('ufs-gridfs.js');
});

Npm.depends({
    'gridfs-stream': '1.1.1'
});
