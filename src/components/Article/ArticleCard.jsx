import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Link } from 'react-router-dom';

const articles = [
  { id: 1, title: 'Understanding Mental Health', content: 'Content of the article goes here...', author: 'Author 1', date: '2024-07-01' },
  { id: 2, title: 'The Importance of Therapy', content: 'Content of the article goes here...', author: 'Author 2', date: '2024-07-05' },
  // Add more articles as needed
];

function ArticleCard(props) {
  const { article } = props;
  const date =  '2024-07-05';
  console.log(article);
  // const post = {
  //   title: 'Understanding Mental Health', 
  //   description: 'Content of the article goes here...', 
  //   author: 'Author 1', 
  //   date: '2024-07-01' 
  // }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component="a" href="#">
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {article.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {date}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {article.description}
            </Typography>
            {/* <Typography variant="subtitle1" color="primary">
              Continue reading...
            </Typography> */}
            <Link to={article.url} target="_blank" variant="subtitle1" color="primary">
              Continue reading...
            </Link>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={article.image_url}
            // alt={post.imageLabel}
          />
        </Card>
      </CardActionArea>
    </Grid>
  );
}


export default ArticleCard;