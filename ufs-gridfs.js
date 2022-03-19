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
import { UploadFS } from 'meteor/jalik:ufs';
import { Meteor } from 'meteor/meteor';

/**
 * GridFS store
 * @param options
 * @constructor
 */
export class GridFSStore extends UploadFS.Store {

  constructor(options) {
    // Default options
    options = Object.assign({
      chunkSize: 1024 * 255,
      collectionName: 'uploadfs',
    }, options);

    // Check options
    if (typeof options.chunkSize !== 'number') {
      throw new TypeError('GridFSStore: chunkSize is not a number');
    }
    if (typeof options.collectionName !== 'string') {
      throw new TypeError('GridFSStore: collectionName is not a string');
    }

    super(options);

    this.chunkSize = parseInt(options.chunkSize);
    this.collectionName = options.collectionName;

    if (Meteor.isServer) {
      let mongo = Package.mongo.MongoInternals.NpmModule;
      let db = Package.mongo.MongoInternals.defaultRemoteCollectionDriver().mongo.db;
      let mongoStore = new mongo.GridFSBucket(db, {
        bucketName: options.collectionName,
        chunkSizeBytes: this.chunkSize,
      });

      /**
       * Removes the file
       * @param fileId
       * @param callback
       */
      this.delete = function (fileId, callback) {
        if (typeof callback !== 'function') {
          callback = function (err) {
            if (err) {
              console.log('error');
            }
          };
        }

        const collectionName = options.collectionName + '.files';
        db.collection(collectionName).findOne({ '_id': fileId }).then((file) => {
          if (file) {
            mongoStore.delete(fileId, callback);
          }
        });
      };

      /**
       * Returns the file read stream
       * @param fileId
       * @param file
       * @param options
       * @return {*}
       */
      this.getReadStream = function (fileId, file, options) {
        options = Object.assign({}, options);
        return mongoStore.openDownloadStream(fileId, options);
      };

      /**
       * Returns the file write stream
       * @param fileId
       * @param file
       * @param options
       * @return {*}
       */
      this.getWriteStream = function (fileId, file, options) {
        let writeStream = mongoStore.openUploadStreamWithId(fileId, fileId, {
          chunkSizeBytes: this.chunkSize,
          contentType: file.type,
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
