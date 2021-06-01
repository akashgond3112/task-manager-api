const express = require("express");
const Tasks = require("../models/task");
const auth= require("../middleware/auth")

const router = new express.Router();

router.post("/tasks", auth,async (req, res) => {
  const task= new Tasks({
    ...req.body,
    owner: req.user._id
  })

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get /tasks?completed=true/false
// GET /tasks/?limit=10&skip=10
// GET /tasks/?sortBy=createdAt_asc/createdAt_desc
/***
 * @param completed the parameter for these method
 * @param limit fetch the first number of task
 * @param skip paginations
 * @sortBy order by createdAt_asc/createdAt_desc
 */
router.get("/tasks", auth,async (req, res) => {
  const match ={}
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true"
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split("_")

    sort[parts[0]] = parts[1] ==='desc' ? -1 : 1
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        },
      })
      .execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth,async (req, res) => {
  try {
    const task= await Tasks.findOne({_id:req.params.id,owner:req.user._id})

    if (!task) return res.status(404).send();
    return res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth,async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperatios = updates.every((update) =>
    allowedUpdates.includes(update)
  );


  if (!isValidOperatios){
    return res.status(400).send({ erorr: "Not a valid request" });
  }
  try {

      const task = await Tasks.findOne({_id:req.params.id,owner:req.user._id})
      if (!task) {
        return res.status(404).send();
      }
      updates.forEach((update) => task[update] = req.body[update]);
      await task.save();
    return res.send(task);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/tasks/:id", auth,async (req, res) => {
  try {
    const taks = await Tasks.findOneAndDelete({ _id:req.params.id, owner: req.user._id });

    if (!task) return res.status(404).send();
    return res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
