import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Typography, Grid } from '@mui/material';
import ArticleCard from './ArticleCard';
import axios from 'axios';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://api.thenewsapi.com/v1/news/all?api_token=' + process.env.apiToken +'&search=mental%20health&categories=health');
        setArticles(response.data.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);
  console.log(articles);

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