import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Grid } from '@mui/material';
import ArticleCard from './ArticleCard';
import { useArticles } from "../../context/articlesContext.jsx";

const ArticleList = () => {

  const {articles, loading, error} = useArticles();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Grid container spacing={4}>
      {articles.map((article) => (
        <ArticleCard key={article.title} article={article} />
      ))}
    </Grid>
  );
};

export default ArticleList;