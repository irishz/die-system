let express = require("express"),
  router = express.Router();

let die = require("../models/die-schema");

router.route("/create").post((req, res, next) => {
  die.create(req.body, (error, data) => {
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
  die.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  })
});

router.route("/:skip/:limit").get((req, res, next) => {
  // eslint-disable-next-line array-callback-return
  die.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  })
  .skip(parseInt(req.params.skip))
  .limit(parseInt(req.params.limit));
});

router.route("/edit/:id").get((req, res, next) => {
  die.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/update/:id").put((req, res, next) => {
  console.log(req.body);
  die.findByIdAndUpdate(
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
        console.log("die updated successfully !");
      }
    }
  );
});

router.route("/delete/:id").delete((req, res, next) => {
  die.findByIdAndRemove(req.params.id, (error, data) => {
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
