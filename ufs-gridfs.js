/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
import {_} from "meteor/underscore";
import {check} from "meteor/check";
import {Meteor} from "meteor/meteor";
import {UploadFS} from "meteor/jalik:ufs";


/**
 * GridFS store
 * @param options
 * @constructor
 */
export class GridFSStore extends UploadFS.Store {

    constructor(options) {
        // Default options
        options = _.extend({
            chunkSize: 1024 * 255,
            collectionName: 'uploadfs'
        }, options);

        // Check options
        if (typeof options.chunkSize !== "number") {
            throw new TypeError("GridFSStore: chunkSize is not a number");
        }
        if (typeof options.collectionName !== "string") {
            throw new TypeError("GridFSStore: collectionName is not a string");
        }

        super(options);
        let self = this;

        this.chunkSize = options.chunkSize;
        this.collectionName = options.collectionName;

        if (Meteor.isServer) {
            const GridFS = Npm.require('gridfs-stream');
            let mongo = Package.mongo.MongoInternals.NpmModule;
            let db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;
            let mongoStore = new GridFS(db, mongo);

            /**
             * Removes the file
             * @param fileId
             * @param callback
             */
            this.delete = function (fileId, callback) {
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
             * @param file
             * @param options
             * @return {*}
             */
            this.getReadStream = function (fileId, file, options) {
                options = _.extend({}, options);
                return mongoStore.createReadStream({
                    _id: fileId,
                    root: self.collectionName,
                    range: {
                        startPos: options.start,
                        endPos: options.end
                    }
                });
            };

            /**
             * Returns the file write stream
             * @param fileId
             * @param file
             * @param options
             * @return {*}
             */
            this.getWriteStream = function (fileId, file, options) {
                let writeStream = mongoStore.createWriteStream({
                    _id: fileId,
                    filename: fileId,
                    mode: 'w',
                    chunkSize: self.chunkSize,
                    root: self.collectionName,
                    content_type: file.type
                });
                writeStream.on('close', function () {
                    writeStream.emit('finish');
                });
                return writeStream;
            };
        }
    }
}

// Add store to UFS namespace
UploadFS.store.GridFS = GridFSStore;
