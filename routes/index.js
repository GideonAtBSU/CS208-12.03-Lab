var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'Fantastiman\'s TODO list', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;
    if (!task || !task.trim()) {
      return res.redirect('/?toast=' + encodeURIComponent('Task cannot be blank') + '&type=error');
    }
    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.redirect('/?toast=' + encodeURIComponent('Error adding todo') + '&type=error');
        }
        console.log('Todo added successfully:', results);
        // Redirect to the home page after adding
        res.redirect('/?toast=' + encodeURIComponent('Todo added'));
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      return res.redirect('/?toast=' + encodeURIComponent('Error adding todo') + '&type=error');
    }
});

router.post('/complete', function (req, res, next) {
  const { id } = req.body;

  req.db.query(
    'UPDATE todos SET completed = !completed WHERE id = ?;',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error editing todo:', err);
        return res.redirect('/?toast=' + encodeURIComponent('Error completing task') + '&type=error');
      }
      res.redirect('/?toast=' + encodeURIComponent('Completed Task'));
    }
  );
});

router.post('/edit', function (req, res, next) {
  const { id, description } = req.body;

  req.db.query(
    'UPDATE todos SET description = ? WHERE id = ?;',
    [description, id],
    (err, results) => {
      if (err) {
        console.error('Error editing todo:', err);
        return res.redirect('/?toast=' + encodeURIComponent('Could not save') + '&type=error');
      }
      res.redirect('/?toast=' + encodeURIComponent('Description saved'));
    }
  );
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.redirect('/?toast=' + encodeURIComponent('Error deleting todo') + '&type=error');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/?toast=' + encodeURIComponent('Todo deleted'));
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        return res.redirect('/?toast=' + encodeURIComponent('Error deleting todo') + '&type=error');
    }
});

module.exports = router;