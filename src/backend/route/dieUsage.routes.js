let express = require("express"),
  router = express.Router();

let dieUsage = require("../models/die-usage-schema");

router.route("/create").post((req, res, next) => {
  dieUsage.create(req.body, (error, data) => {
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
  dieUsage.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// get data by machine nubmer
router.route("/find/:mcno").get((req, res, next) => {
  // eslint-disable-next-line array-callback-return
  dieUsage.find({mcno: req.params.mcno},(error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/edit/:id").get((req, res, next) => {
  dieUsage.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/update/:id").put((req, res, next) => {
  console.log(req.body);
  dieUsage.findByIdAndUpdate(
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
        console.log("dieUsage updated successfully !");
      }
    }
  );
});

router.route("/delete/:id").delete((req, res, next) => {
  dieUsage.findByIdAndRemove(req.params.id, (error, data) => {
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