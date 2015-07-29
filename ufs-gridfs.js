/**
 * GridFS store
 * @param options
 * @constructor
 */
UploadFS.store.GridFS = function (options) {
    // Set default options
    options = _.extend({
        chunkSize: 1024 * 255
    }, options);

    // Check options
    if (typeof options.chunkSize !== 'number') {
        throw new TypeError('chunkSize is not a number');
    }

    // Create the store
    var store = new UploadFS.Store(options);

    if (Meteor.isServer) {
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
            // todo delete the file
        };

        /**
         * Returns the file read stream
         * @param fileId
         * @return {*}
         */
        store.getReadStream = function (fileId) {
            // todo return read stream
        };

        /**
         * Returns the file write stream
         * @param fileId
         * @return {*}
         */
        store.getWriteStream = function (fileId) {
            // todo return write stream
        };
    }

    return store;
};