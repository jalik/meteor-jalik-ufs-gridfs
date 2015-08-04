if (Meteor.isServer) {
    var Grid = Npm.require('gridfs-stream');
}

/**
 * GridFS store
 * @param options
 * @constructor
 */
UploadFS.store.GridFS = function (options) {
    // Set default options
    options = _.extend({
        chunkSize: 1024 * 255,
        collectionName: 'uploadfs'
    }, options);

    // Check options
    if (!Match.test(options.chunkSize, Number)) {
        throw new TypeError('chunkSize is not a number');
    }

    if (!Match.test(options.collectionName, String)) {
        throw new TypeError('collectionName is not a string');
    }

    // Create the store
    var store = new UploadFS.Store(options);

    if (Meteor.isServer) {
        var mongo = Package.mongo.MongoInternals.NpmModule;
        var db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;

        mongoStore = new Grid(db, mongo);

        /**
         * Removes the file
         * @param fileId
         * @param callback
         */
        store.delete = function (fileId, callback) {
            if (typeof callback !== 'function') {
                callback = function (err) {
                    if (err) {
                        console.error(err);
                    }
                }
            }
            
            return mongoStore.remove({
                filename: fileId,
                root: options.collectionName
            }, callback);
        };

        /**
         * Returns the file read stream
         * @param fileId
         * @return {*}
         */
        store.getReadStream = function (fileId) {
            return mongoStore.createReadStream({
                _id: fileId,
                root: options.collectionName
            });
        };

        /**
         * Returns the file write stream
         * @param fileId
         * @return {*}
         */
        store.getWriteStream = function (fileId, file) {
            var writeStream = mongoStore.createWriteStream({
                _id: fileId,
                filename: fileId,
                mode: 'w',
                chunkSize: options.chunkSize,
                root: options.collectionName,
                content_type: file.type
            });

            writeStream.on('close', function() {
                writeStream.emit('finish');
            });

            return writeStream;
        };
    }

    return store;
};