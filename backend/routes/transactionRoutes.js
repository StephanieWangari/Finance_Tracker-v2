const router = require("express").Router();
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

// ADD
router.post("/", auth, async (req, res) => {
  const transaction = new Transaction({
    ...req.body,
    userId: req.user.id
  });

  await transaction.save();
  res.json(transaction);
});

// GET ALL
router.get("/", auth, async (req, res) => {
  const data = await Transaction.find({ userId: req.user.id });
  res.json(data);
});

module.exports = router;