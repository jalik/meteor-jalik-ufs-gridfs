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

### Create a Store

**The code below is available on the client and the server.**

GridFS store files in a Mongo database by cutting them in chunks.

```js
Meteor.photos = new Mongo.Collection('photos');

Meteor.photosStore = new UploadFS.store.GridFS({
    collection: Meteor.photos,
    name: 'photos',
    chunkSize: 1024 * 255
});
```