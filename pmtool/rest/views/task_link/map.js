function(doc) {
  if (typeof doc.doctype !== 'undefined' && (doc.doctype == 'task' || doc.doctype == 'link')) {
    emit(doc._id, doc);
  }
};