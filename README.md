# UploadFS-GridFS

A Mongo GridFS store for UploadFS.

### Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:ufs-gridfs
```

If later you want to remove the package :
```
meteor remove jalik:ufs-gridfs
```

### Creating a Store

**The code below is available on the client and the server.**

GridFS store files in a Mongo database by cutting them in chunks.

```js
let Photos = new Mongo.Collection('photos');

let PhotoStore = new UploadFS.store.GridFS({
    collection: Photos,
    name: 'photos',
    chunkSize: 1024 * 255
});
```
