# UploadFS GridFS Store

A Mongo GridFS store for UploadFS.

## Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:ufs-gridfs
```

If later you want to remove the package :
```
meteor remove jalik:ufs-gridfs
```

## Creating a Store

**The code below is available on the client and the server.**

GridFS store files in a Mongo database by cutting them in chunks.

```js
import {Mongo} from 'meteor/mongo';
import {UploadFS} from 'meteor/jalik:ufs';
import {GridFSStore} from 'meteor/jalik:ufs-gridfs';

// Declare store collection
const Photos = new Mongo.Collection('photos');

// Declare store
const PhotoStore = new GridFSStore({
    collection: Photos,
    name: 'photos',
    chunkSize: 1024 * 255
});
```

## License

This package is released under the [MIT License](http://www.opensource.org/licenses/MIT).
