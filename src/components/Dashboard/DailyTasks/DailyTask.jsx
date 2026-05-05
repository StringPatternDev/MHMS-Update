import React from 'react';
import { Checkbox, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const DailyTask = ({ task, completed, handleToggle }) => {
  return (
    <ListItem>
      <ListItemText primary={task} />
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          checked={completed}
          onChange={() => handleToggle(task)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default DailyTask;
