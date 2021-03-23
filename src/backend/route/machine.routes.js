let express = require("express"),
  router = express.Router();

let machine = require("../models/machine-schema");

router.route("/create").post((req, res, next) => {
  machine.create(req.body, (error, data) => {
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
  machine.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/edit/:id").get((req, res, next) => {
  machine.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/update/:id").put((req, res, next) => {
  machine.findByIdAndUpdate(
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
        console.log("machine updated successfully !");
      }
    }
  );
});

router.route("/delete/:id").delete((req, res, next) => {
  machine.findByIdAndRemove(req.params.id, (error, data) => {
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
