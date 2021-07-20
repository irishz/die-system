let express = require("express"),
  router = express.Router();

let dieTrans = require("../models/die-trans-schema");

router.route("/create").post((req, res, next) => {
  dieTrans.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

router.route("/").get((req, res, next) => {
  // eslint-disable-next-line array-callback-return
  dieTrans.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/gettrans/:item").get((req, res, next) => {
  dieTrans.find({ item: req.params.item }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/update/:id").put((req, res, next) => {
  console.log(req.body);
  dieTrans.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        console.log(error);
        return next(error);
      } else {
        res.json(data);
        console.log("dieTrans updated successfully !");
      }
    }
  );
});

router.route("/delete/:id").delete((req, res, next) => {
  dieTrans.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
});

module.exports = router;
