import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';


const ArticlesContext = createContext();
export const useArticles = () => useContext(ArticlesContext);

export const ArticlesProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {

                const BASE_URL = "https://api.thenewsapi.com/v1/news/all";
                const allArticles = [];

                for (let page = 1; page <= 4; page++) {
                    const response = await axios.get(BASE_URL, {
                        params: {
                            api_token: process.env.REACT_APP_NEWS_API_TOKEN,
                            categories: "health",
                            search: "mental health OR depression OR anxiety OR psychology",
                            language: "en",
                            limit: 3,   // API is returning 3 anyway
                            page: page
                        }
                    });

                    if (response.data?.data?.length) {
                        allArticles.push(...response.data.data);
                    } else {
                        break; // no more data
                    }
                }

                setArticles(allArticles);

                // const response = await axios.get('https://api.thenewsapi.com/v1/news/all?api_token=' + process.env.apiToken + '&search=mental%20health&categories=health');
                // setArticles(response.data.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);
    console.log(articles);



    return (
        <ArticlesContext.Provider value={{ articles, loading, error }}>
            {children}
        </ArticlesContext.Provider>
    );
};