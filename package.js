Package.describe({
    name: 'jalik:ufs-gridfs',
    version: '0.2.0',
    author: 'rodrigoknascimento@gmail.com',
    summary: 'GridFS store for UploadFS',
    homepage: 'https://github.com/jalik/jalik-ufs-gridfs',
    git: 'https://github.com/jalik/jalik-ufs-gridfs.git',
    documentation: 'README.md',
    license: 'MIT'
});

Package.onUse(function (api) {
    api.versionsFrom('1.4.2.6');
    api.use('ecmascript@0.6.1');
    api.use('underscore@1.0.10');
    api.use('mongo@1.1.14');
    api.use('jalik:ufs@0.7.4_1');
    api.addFiles('ufs-gridfs.js');
});
