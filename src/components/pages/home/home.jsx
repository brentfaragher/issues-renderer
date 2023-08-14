import React, { useState } from "react";
import styles from "./styles/home.module.css";
import githubClient from "../../../githubClient";

function Home() {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [morePages, setMorePages] = useState(false);
  const resultsPerPage = 30;

  const searchUpated = (event) => {
    setSearchQuery(event.target.value);
  };

  const onKeyUp = async (event) => {
    // Fetch issues if user hits enter key
    if (event.charCode === 13) {
      fetchIssues();
    }
  };

  const fetchIssues = async (nextPage) => {
    // Reset to defaults for new searches
    if (!nextPage) {
      setPage(1);
      setMorePages(false);
    }

    const issuesResult = await githubClient.getIssuesForRepo(
      searchQuery,
      nextPage ? page + 1 : null
    );
    const { success, result } = issuesResult;
    if (success) {
      if (!nextPage) {
        setIssues(result);
      } else {
        // Combine new results with previous results and increment page number
        const allResults = issues.concat(result);
        setIssues(allResults);
        setPage(page + 1);
      }
      if (result.length === resultsPerPage) {
        setMorePages(true);
      } else {
        setMorePages(false);
      }
    } else {
      alert("Oops: " + issuesResult.error);
    }
  };

  const loadNextPage = () => {
    fetchIssues(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Issues Renderer</h1>
      <div className={styles.searchContainer}>
        <input
          id="search"
          className={styles.searchBar}
          onKeyPress={onKeyUp}
          onChange={searchUpated}
        ></input>
        <button
          onClick={() => fetchIssues(null)}
          className={styles.searchButton}
        >
          <img width="20px" height="20px" src="/Magnifying_glass_icon.png" />
        </button>
      </div>
      <div className={styles.issuesContainer}>
        <div className={styles.issuesHeader}>
          <div className={styles.issueCount}>{issues.length} Open Issues</div>
        </div>
        <div className={styles.issuesScrollView}>
          {issues.map((issue) => {
            return (
              <div className={styles.issueRow} key={issue.id}>
                <div className={styles.issueRowNumber}>#{issue.number}</div>
                <div className={styles.issueTitle}>
                  {issue.title}
                  <span className={styles.toolTipText}>{issue.body}</span>
                </div>
                {issue.labels.map((label) => {
                  const colorStr = `#${label.color}`;
                  return (
                    <div
                      className={styles.label}
                      style={{ backgroundColor: colorStr }}
                    >
                      {label.name}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {morePages ? (
            <button onClick={loadNextPage} className={styles.loadMoreButton}>
              Load More
            </button>
          ) : null}
        </div>
      </div>
      <p className={styles.footerSourceLink}>
        Full Source Code:{" "}
        <a href="https://github.com/brentfaragher/issues-renderer">
          https://github.com/brentfaragher/issues-renderer
        </a>
      </p>
      <p className={styles.footerSourceLink}>
        <a target="_blank" href="https://railway.app">
          Powered By Railway
        </a>
      </p>
    </div>
  );
}

export default Home;
