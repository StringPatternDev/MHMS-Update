// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from 'axios';


// const ArticlesContext = createContext();
// export const useArticles = () => useContext(ArticlesContext);

// export const ArticlesProvider = ({ children }) => {
//     const [articles, setArticles] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchArticles = async () => {
//             try {

//                 const BASE_URL = "https://api.thenewsapi.com/v1/news/all";
//                 const allArticles = [];

//                 for (let page = 1; page <= 4; page++) {
//                     const response = await axios.get(BASE_URL, {
//                         params: {
//                             api_token: process.env.REACT_APP_NEWS_API_TOKEN,
//                             categories: "health",
//                             search: "mental health OR depression OR anxiety OR psychology",
//                             language: "en",
//                             limit: 3,   // API is returning 3 anyway
//                             page: page
//                         }
//                     });

//                     if (response.data?.data?.length) {
//                         allArticles.push(...response.data.data);
//                     } else {
//                         break; // no more data
//                     }
//                 }

//                 setArticles(allArticles);

//                 // const response = await axios.get('https://api.thenewsapi.com/v1/news/all?api_token=' + process.env.apiToken + '&search=mental%20health&categories=health');
//                 // setArticles(response.data.data);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error);
//                 setLoading(false);
//             }
//         };
//         fetchArticles();
//     }, []);
//     console.log(articles);



//     return (
//         <ArticlesContext.Provider value={{ articles, loading, error }}>
//             {children}
//         </ArticlesContext.Provider>
//     );
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ArticlesContext = createContext();
export const useArticles = () => useContext(ArticlesContext);

const BASE_URL = "https://api.thenewsapi.com/v1/news/all";
const PER_PAGE = 3;
const INITIAL_PAGES = 3;

export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = async (pageNumber) => {
    const response = await axios.get(BASE_URL, {
      params: {
        api_token: process.env.apiToken,
        categories: "health",
        search: "mental health OR depression OR anxiety OR psychology",
        language: "en",
        limit: PER_PAGE,
        page: pageNumber
      }
    });

    return response.data.data || [];
  };

  // ✅ FIRST TIME: load 3 pages automatically
  useEffect(() => {
    const fetchInitialArticles = async () => {
      try {
        setLoading(true);

        const allArticles = [];
        for (let p = 1; p <= INITIAL_PAGES; p++) {
          const data = await fetchPage(p);
          if (data.length === 0) {
            setHasMore(false);
            break;
          }
          allArticles.push(...data);
        }

        // ✅ remove duplicates
        const unique = Array.from(
          new Map(allArticles.map(a => [a.uuid, a])).values()
        );

        setArticles(unique);
        setPage(INITIAL_PAGES);
      } catch (err) {
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialArticles();
  }, []);

  // ✅ LOAD MORE (1 page at a time)
  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const nextPage = page + 1;
      const data = await fetchPage(nextPage);

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setArticles(prev => {
        const map = new Map(prev.map(a => [a.uuid, a]));
        data.forEach(a => map.set(a.uuid, a));
        return Array.from(map.values());
      });

      setPage(nextPage);
    } catch (err) {
      setError("Failed to load more articles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        loading,
        error,
        loadMore,
        hasMore
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};