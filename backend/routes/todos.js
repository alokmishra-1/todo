import {Router} from "express"
import pool from "../db.js"

const router = Router();

// create a new todo in table
router.post("/",async(req,res) =>{
    try{
        const {description,completed} = req.body;
        if(!description) {
            return res.status(400).json({error:"Description is required"})
        }
        const newTodo = await pool.query(
            "INSERT INTO todo (description,completed) VALUES ($1,$2) RETURNING *",
            [description,completed || false]
        )
        res.json(newTodo.rows[0])
    }
    catch(err){
        console.error(err.message)
        res.status(500).send("Server is not working")
    }
})

// show all todos
router.get("/hi",async(req,res) => {
    try{
        const allTodo = await pool.query(
        "SELECT * FROM todo"
    )
    res.json(allTodo.rows)   
    }
    catch(err){
        console.error(err.message)
        res.status(500).send("server is not working")
    }
})

//updat all todos
router.put("/:id",async(req,res) => {
    try{
        const {id} = req.params
        const {description,completed} = req.body
        if(!description) {
            return res.status(400).json({error:"Description is required"})
        }
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
            [description,completed || false,id]
        )
         
        if(updateTodo.rows.length === 0){
            return res.status(404).json({msg:"To do not found"})
        }
        res.json({
            message:"To do was updated",
            todo:updateTodo.rows[0]
    })
    }
    catch(err){
        console.error(err.message)
        res.status(500).json("server not found")
    }
})

// delete a todo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );
    if (deleteTodo.rows.length === 0) {
      return res.status(404).json({ msg: "To do not found" });
    }
    res.json({ msg: "Todo deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json("server error");
  }
});


export default router;