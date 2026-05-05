import React, { useState } from 'react';
import { Paper, Typography, List } from '@mui/material';
import DailyTask from './DailyTask';

const DailyTasks = () => {
  const [tasks, setTasks] = useState([
    { task: 'Stretch', completed: true },
    { task: '5 Times Salat', completed: false },
    { task: 'Home Workout', completed: false },
    { task: 'Go for a walk', completed: false },
    { task: 'Get fresh air outdoors', completed: false },
    { task: 'Read a book', completed: false },
  ]);

  const handleToggle = (taskToToggle) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task === taskToToggle ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, flexGrow: 1  }}>
      <Typography variant="h6">Daily Tasks</Typography>
      <List>
        {tasks.map((taskObj) => (
          <DailyTask
            key={taskObj.task}
            task={taskObj.task}
            completed={taskObj.completed}
            handleToggle={handleToggle}
          />
        ))}
      </List>
    </Paper>
  );
};

export default DailyTasks;
