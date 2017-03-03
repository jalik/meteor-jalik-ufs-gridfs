import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';
import {UploadFS} from 'meteor/jalik:ufs';

/**
 * GridFS store
 * @param options
 * @constructor
 */
UploadFS.store.GridFS = function (options) {
    // Default options
    options = _.extend({
        chunkSize: 1024 * 255,
        collectionName: 'uploadfs'
    }, options);

    // Check options
    if (typeof options.chunkSize !== 'number') {
        throw new TypeError('chunkSize is not a number');
    }
    if (typeof options.collectionName !== 'string') {
        throw new TypeError('collectionName is not a string');
    }

    // Create the store
    let store = new UploadFS.Store(options);

    store.chunkSize = options.chunkSize;
    store.collectionName = options.collectionName;

    if (Meteor.isServer) {
        let mongo = Package.mongo.MongoInternals.NpmModule;
        let db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;
        let mongoStore = new mongo.GridFSBucket(db, {
          bucketName: options.collectionName,
          chunkSizeBytes: options.chunkSize
        });

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
            return mongoStore.delete(fileId, callback);
        };

        /**
         * Returns the file read stream
         * @param fileId
         * @param file
         * @param options
         * @return {*}
         */
        store.getReadStream = function (fileId, file, options) {
            options = _.extend({}, options);
            return mongoStore.openDownloadStream(fileId, {
              start: options.start,
              end: options.end
            });
        };

        /**
         * Returns the file write stream
         * @param fileId
         * @param file
         * @param options
         * @return {*}
         */
        store.getWriteStream = function (fileId, file, options) {
            let writeStream = mongoStore.openUploadStreamWithId(fileId, fileId, {
              chunkSizeBytes: store.chunkSize,
              contentType: file.type
            });
            writeStream.on('close', function () {
                writeStream.emit('finish');
            });
            return writeStream;
        };
    }

    return store;
};
