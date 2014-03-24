// RESTFul Routes for the list object
var listController = require ('../controllers/lists')

module.exports = function (app) {
  app.get( "/lists"             , listController.index );
  app.get( "/lists/:name"       , listController.show  );
  app.post("/lists/:name"       , listController.upsert);
  app.del( "/lists/:name"       , listController.delete);
  app.get( "/lists/:name/pick"  , listController.pickItem);
  app.post("/lists/:name/remove", listController.removeItem);
  app.post("/lists/:name/remove/:item", listController.removeItem);
  app.post("/lists/:name/add/:item", listController.addItem);
}
